import { UserGroupTableComponent } from './../user-group-table/user-group-table.component';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { UserGroup } from './../../../shared/models/user-group-action.model';
import { UserGroupAction } from './../../../shared/enums/user-group-action';
import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-group',
  templateUrl: './user-group.component.html',
  styleUrls: ['./user-group.component.css'],
})
export class UserGroupComponent {
  @ViewChild('snackBarTemplate') snackBarTemplate: TemplateRef<any>;
  userGroupAction = UserGroupAction;
  username: string;
  succesMessage: boolean;
  typeMessage: UserGroupAction;
  config: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
    panelClass: ['msg-error'],
  };
  @ViewChild('groupTableJoin') groupTableJoin: UserGroupTableComponent;
  @ViewChild('groupTableLeave') groupTableLeave: UserGroupTableComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: { username: string },
    private snackBar: MatSnackBar,
    private manageUsersService: ManageUsersService
  ) {
    this.username = data.username;
  }

  actionClick(userGroupAction: UserGroup) {
    switch (userGroupAction.action) {
      case UserGroupAction.Join:
        this.manageUsersService
          .addUserToGroup(this.username, userGroupAction.groupname)
          .subscribe(
            (result) => this.resultHandler(result, UserGroupAction.Join),
            () => this.resultHandler(false, UserGroupAction.Join)
          );
        break;
      case UserGroupAction.Leave:
        this.manageUsersService
          .removeUserFromGroup(this.username, userGroupAction.groupname)
          .subscribe(
            (result) => this.resultHandler(result, UserGroupAction.Leave),
            () => this.resultHandler(false, UserGroupAction.Leave)
          );
        break;
    }
  }

  private resultHandler(success: boolean, typeMessage: UserGroupAction) {
    this.succesMessage = success;
    this.typeMessage = typeMessage;
    this.config = success
      ? { ...this.config, panelClass: ['msg-success'] }
      : { ...this.config, panelClass: ['msg-error'] };
    this.snackBar.openFromTemplate(this.snackBarTemplate, this.config);
    this.groupTableJoin.loadRecords();
    this.groupTableLeave.loadRecords();
  }

  dismissSnackbar(): void {
    this.snackBar.dismiss();
  }
}
