import { UserInfo } from 'src/app/shared/models/user-info.model';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
})
export class UserInfoComponent implements OnInit {
  @ViewChild('snackBarTemplate') snackBarTemplate: TemplateRef<any>;
  succesMessage = true;
  userName: string;
  user: UserInfo;
  config: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
    panelClass: ['msg-error'],
  };

  constructor(
    private snackBar: MatSnackBar,
    private manageUsersService: ManageUsersService,
    private authenticationService: AuthenticationService
  ) {}

  async ngOnInit(): Promise<void> {
    this.userName = await this.authenticationService.getUserName();
    this.manageUsersService
      .getUser(this.userName)
      .subscribe((result) => (this.user = result));
  }

  onClickSave() {
    this.manageUsersService.updateUser(this.userName, this.user).subscribe(
      (result) => this.resultHandler(result),
      () => this.resultHandler(false)
    );
  }

  private resultHandler(success: boolean) {
    this.succesMessage = success;
    this.config = this.succesMessage
      ? { ...this.config, panelClass: ['msg-success'] }
      : { ...this.config, panelClass: ['msg-error'] };
    this.snackBar.openFromTemplate(this.snackBarTemplate, this.config);
  }

  dismissSnackbar(): void {
    this.snackBar.dismiss();
  }
}
