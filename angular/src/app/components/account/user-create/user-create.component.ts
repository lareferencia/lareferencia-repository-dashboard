import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { UserInfo } from 'src/app/shared/models/user-info.model';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css'],
})
export class UserCreateComponent {
  @ViewChild('snackBarTemplate') snackBarTemplate: TemplateRef<any>;
  @ViewChild('userForm', {static: false}) userForm: NgForm;
  user = {} as UserInfo;
  succesMessage = true;
  config: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
    panelClass: ['msg-error'],
  };

  constructor(
    private snackBar: MatSnackBar,
    private manageUsersService: ManageUsersService
  ) {}

  onClickSave() {
    if (!this.userForm.invalid) {
      this.manageUsersService.createUser(this.user).subscribe(
        (result) => this.resultHandler(result),
        () => this.resultHandler(false)
      );
    } else {
      this.resultHandler(false);
    }
  }

  private resultHandler(success: boolean) {
    if (success) this.userForm.resetForm();
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
