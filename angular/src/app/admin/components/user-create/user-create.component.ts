import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ManageUsersService } from 'src/app/core/services/manage-users.service';

import { UserInfo } from 'src/app/shared/models/user-info.model';

import { MessageService } from 'primeng/api';


interface PositionTypes{
  name: string
}

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css'],
  providers: [MessageService]
})
export class UserCreateComponent implements OnInit  {
  @ViewChild('userForm', {static: false}) userForm: NgForm;

  public loading = false;
  public user = {} as UserInfo;
  public positions: PositionTypes[];


  constructor(
    private manageUsersService: ManageUsersService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.positions = [
      { name: 'Node Administrator'},
      { name: 'Assistant/Auxiliary'},
      { name: 'Librarian'},
      { name: 'Repository Manager'},
      { name: 'Technical Responsible'},
    ]
  }

  onClickSave() {
    this.loading = true;

    if (!this.userForm.invalid 
        && this.user.username.length > 0 
        && this.user.email.includes('@')
        && this.user.password.length > 0) {

      this.manageUsersService.createUser(this.user).subscribe(
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
      this.userForm.resetForm();
      this.messageService.add({
        severity:'success',
        summary: 'Success',
        detail: 'User created successfully'
      })
    } else{
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'User creation failed'
      })
    }
  }
}
