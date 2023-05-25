import { Component } from '@angular/core';

import { UserTableComponent } from './../user-table/user-table.component';

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
