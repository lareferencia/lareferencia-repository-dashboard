import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ManageGroupsService } from 'src/app/core/services/manage-groups.service';

import { GroupInfo } from 'src/app/shared/models/group-info.model';

import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-group-create',
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.css'],
  providers: [MessageService]
})
export class GroupCreateComponent {
  @ViewChild('groupForm', { static: false }) groupForm: NgForm;
  public group = {} as GroupInfo;
  public succesMessage = true;
  public loading = false;


  constructor(
    private manageGroupsService: ManageGroupsService,
    private messageService: MessageService
  ) {}

  onClickSave() {
    this.loading = true;

    if (!this.groupForm.invalid 
        && this.group.name.length > 0) {

      this.manageGroupsService.createGroup(this.group).subscribe(
        (result) => this.resultHandler(result),
        () => this.resultHandler(false)
      );
    } else {
      this.loading = false;
    }
  }

  private resultHandler(success: boolean) {
    this.loading = false
    if (success) {
      this.groupForm.resetForm();
      this.messageService.add({
        severity:'success',
        summary: 'Success',
        detail: 'Group created successfully'
      })
    } else{
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error creating group'
      })
    }
  }


}
