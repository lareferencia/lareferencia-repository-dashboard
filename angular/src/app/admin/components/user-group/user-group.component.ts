import { Component, Input, TemplateRef, ViewChild } from '@angular/core';

import { ManageUsersService } from 'src/app/core/services/manage-users.service';

import { UserGroupTableComponent } from './../user-group-table/user-group-table.component';

import { UserGroup } from './../../../shared/models/user-group-action.model';
import { UserGroupAction } from './../../../shared/enums/user-group-action';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-group',
  templateUrl: './user-group.component.html',
  providers: [MessageService]
})
export class UserGroupComponent  {
  @ViewChild('snackBarTemplate') snackBarTemplate: TemplateRef<any>;
  @ViewChild('groupTableJoin') groupTableJoin: UserGroupTableComponent;
  @ViewChild('groupTableLeave') groupTableLeave: UserGroupTableComponent;

  @Input() dialogData: any;
  
  public userGroupAction = UserGroupAction;
  public succesMessage: boolean;
  public typeMessage: UserGroupAction;
  

  constructor(
    private manageUsersService: ManageUsersService,
    private messageService: MessageService
  ) {
  }


  actionClick(userGroupAction: UserGroup) {
    switch (userGroupAction.action) {
      case UserGroupAction.Join:
        this.manageUsersService
          .addUserToGroup(this.dialogData.username, userGroupAction.groupname)
          .subscribe(
            (result) => this.resultHandler(result, UserGroupAction.Join),
            () => this.resultHandler(false, UserGroupAction.Join)
          );
        break;
      case UserGroupAction.Leave:
        this.manageUsersService
          .removeUserFromGroup(this.dialogData.username, userGroupAction.groupname)
          .subscribe(
            (result) => this.resultHandler(result, UserGroupAction.Leave),
            () => this.resultHandler(false, UserGroupAction.Leave)
          );
        break;
    }
  }

  private resultHandler(success: boolean, typeMessage: UserGroupAction) {

    this.messageService.add({
      severity: success ? 'success' : 'error',
      summary: success ? 'Success' : 'Error',
      detail:`${typeMessage === this.userGroupAction.Leave 
        ? 'Removed group membership' 
        :'Added group membership' } ` ,
      life: 2000
    })
    this.groupTableJoin.loadRecords();
    this.groupTableLeave.loadRecords();
  }
}
