import { Component, OnInit } from '@angular/core';

import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

import { UserInfo } from 'src/app/shared/models/user-info.model';

import { MessageService } from 'primeng/api';

interface Position{
  name:string;
}

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
  providers: [MessageService]
})


export class UserInfoComponent implements OnInit {
  public updatingSuccess = true;
  public userName: string;
  public user: UserInfo;
  public positions: Position[] = [];
 
  constructor(
    private manageUsersService: ManageUsersService,
    private authenticationService: AuthenticationService,
    private messageService: MessageService
  ) {}

  async ngOnInit(): Promise<void> {
    this.userName = await this.authenticationService.getUserName();
    this.manageUsersService
      .getUser(this.userName)
      .subscribe((result) => (this.user = result));

    this.positions = [
      {name: 'Node Administrator'},
      {name: 'Assistant/Auxiliary'},
      {name: 'Librarian'},
      {name: 'Repository Manager'},
      {name: 'Technical Responsible'},
      {name: 'None'},
    ]
  }

  onClickSave() {
    this.updatingSuccess = false;

    if( this.userName.length < 1) return;

    this.manageUsersService.updateUser(this.userName, this.user).subscribe(
      (result) => this.resultHandler(result),
      () => this.resultHandler(false)
    );
  }

  private resultHandler(success: boolean) {
    this.updatingSuccess = true;
    success === true
    ? this.messageService.add(
      { severity: 'success', summary: 'Info', detail: 'Information updated successfully!' })
    : this.messageService.add(
      { severity: 'error', summary: 'Info', detail: 'Error updating information!' })
  }
}
