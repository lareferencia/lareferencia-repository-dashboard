import {Component, OnInit } from '@angular/core';

import { ManageUsersService } from './../../../core/services/manage-users.service';

import { ConfirmationService } from 'primeng/api';


import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css'],
  providers: [ConfirmationService]
})
export class UserTableComponent implements OnInit {
  
  public dataSource: User[];
  public csvData: any[];
  public headerData: any[];
  public users: User[];
  public dialogData: any;
  public visible:boolean;


  constructor(
    private manageUsersService: ManageUsersService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(){
    this.manageUsersService.getRegularUserList().subscribe((result) => {
      this.dataSource = result
      this.csvData = result.map((x) => ({ username: x.username }));
      this.headerData = ['Username'];
    });

  }

  onDeleteUser(event: Event, user: User) {
        this.confirmationService.confirm({
            target: event.target,
            message: `You going to delete ${user.username} user, are you sure?`,
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.manageUsersService.deleteUser(user.username).subscribe(() =>{
                this.loadUsers();
              })
            },
            reject: () => {
            }
        });
    }

  onDialogHide(){
    this.dialogData = null;
  }

  groupClick(user: User): void {

    this.visible = true;
    this.dialogData = { username: user.username }
  }
}
