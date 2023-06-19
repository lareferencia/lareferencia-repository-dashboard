import { Component, OnInit } from '@angular/core';

import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

import { UserInfo } from 'src/app/shared/models/user-info.model';

import { MessageService } from 'primeng/api';
import { PositionType } from 'src/app/shared/enums/user-position';

interface PositionOptions{
  label:string;
  value: PositionType;
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
  public positions: PositionOptions[] = [];
 
  constructor(
    private manageUsersService: ManageUsersService,
    private authenticationService: AuthenticationService,
    private messageService: MessageService
  ) {}

  async ngOnInit(): Promise<void> {
    this.userName = await this.authenticationService.getUserName();
    this.manageUsersService
      .getUser(this.userName)
      .subscribe((result) => {
       this.user = result
       console.log(result)
      });
      
      this.positions = [
        { label: 'Node Administrator', value: PositionType.NodeAdministrator },
        { label: 'Assistant/Auxiliary', value: PositionType.AssistantAuxiliary },
        { label: 'Librarian', value: PositionType.Librarian },
        { label: 'Repository Manager', value: PositionType.RepositoryManager },
        { label: 'Technical Responsible', value: PositionType.TechnicalResponsible }
      ];
  }

  check(event){
    console.log(event)

  }

  onClickSave() {
    this.updatingSuccess = false;

    console.log(this.user.position)

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
