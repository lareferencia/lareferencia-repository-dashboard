import { GroupInfo } from 'src/app/shared/models/group-info.model';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ManageGroupsService } from 'src/app/core/services/manage-groups.service';
import { NgForm } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-group-create',
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.css'],
})
export class GroupCreateComponent {
  @ViewChild('snackBarTemplate') snackBarTemplate: TemplateRef<any>;
  @ViewChild('groupForm', { static: false }) groupForm: NgForm;
  group = {} as GroupInfo;
  succesMessage = true;
  config: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
    panelClass: ['msg-error'],
  };

  constructor(
    private manageGroupsService: ManageGroupsService,
    private snackBar: MatSnackBar
  ) {}

  onClickSave() {
    if (!this.groupForm.invalid) {
      this.manageGroupsService.createGroup(this.group).subscribe(
        (result) => this.resultHandler(result),
        () => this.resultHandler(false)
      );
    } else {
      this.resultHandler(false);
    }
  }

  private resultHandler(success: boolean) {
    if (success) this.groupForm.resetForm();
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
