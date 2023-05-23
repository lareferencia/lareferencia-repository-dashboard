import { DeleteType } from 'src/app/shared/enums/delete-type';
import { UserGroupComponent } from './../user-group/user-group.component';
import { DeleteConfirmationComponent } from './../delete-confirmation/delete-confirmation.component';
import { ManageUsersService } from './../../../core/services/manage-users.service';
import {Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';
import { UserTableDataSource } from './user-table-datasource';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css'],
})
export class UserTableComponent implements OnInit {
  
  dataSource: User[];
  displayedColumns = ['username', 'button-delete'];
  csvData: any[];
  headerData: any[];
  usernameFilter: string;
  users: User[];

  constructor(
    private manageUsersService: ManageUsersService,
  ) {}

  ngOnInit() {
    this.manageUsersService.getRegularUserList().subscribe((result) => {
      this.dataSource = result
    });
  }
  applyFilter(){
    
  }


  // private loadData(users: User[]) {

  //   this.csvData = users.map((x) => ({ username: x.username }));

  // }

  // deleteClick(user: User): void {
  //   const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
  //     data: {type: DeleteType.User, description: user.username}
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result)
  //       this.manageUsersService.deleteUser(user.username).subscribe(() => {
  //         this.loadRecords();
  //       });
  //   });
  // }

  // groupClick(user: User): void {
  //   this.dialog.open(UserGroupComponent, {
  //     data: { username: user.username },
  //   });
  // }

  // applyFilter() {
  //   let userFiltered = this.users;
  //   if (!!this.usernameFilter?.trim()) {
  //     userFiltered = this.users.filter((x) =>
  //       x.username.toUpperCase().includes(this.usernameFilter.toUpperCase())
  //     );
  //   }
  //   this.loadData(userFiltered);
  // }
}
