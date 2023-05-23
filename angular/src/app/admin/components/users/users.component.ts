import { UserTableComponent } from './../user-table/user-table.component';
import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent {
  // @ViewChild(UserTableComponent) userTableChild: UserTableComponent;
  // openUserGroup() {
  //   this.userTableChild.loadRecords();
  // }
}
