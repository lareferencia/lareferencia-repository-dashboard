import { Component, OnInit } from '@angular/core';

import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

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
  public user: any;
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
       this.user.position = parseInt(this.user.position);
      });
      
      this.positions = [
        { label: 'Node Administrator', value: PositionType.NodeAdministrator },
        { label: 'Assistant/Auxiliary', value: PositionType.AssistantAuxiliary },
        { label: 'Librarian', value: PositionType.Librarian },
        { label: 'Repository Manager', value: PositionType.RepositoryManager },
        { label: 'Technical Responsible', value: PositionType.TechnicalResponsible }
      ];
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
