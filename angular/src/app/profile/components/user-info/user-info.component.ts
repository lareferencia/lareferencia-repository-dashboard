import { Component, OnInit } from '@angular/core';

import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

import { MessageService } from 'primeng/api';
import { PositionType } from 'src/app/shared/enums/user-position';
import { FormBuilder, FormGroup , Validators } from '@angular/forms';

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
  public positions: PositionOptions[] = [];
  public userForm: FormGroup;
  public isLoading = true;
 
  constructor(
    private manageUsersService: ManageUsersService,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private fb: FormBuilder,
  ) {
    this.userForm = this.fb.group({
      first_name: [''],
      email: ['', [ Validators.required, Validators.email ]],
      telephone: [''],
      affiliation: [''],
      position: [''],
    });
  }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.userName = await this.authenticationService.getUserName();
    this.manageUsersService
      .getUser(this.userName)
      .subscribe((result: any) => {

        this.isLoading = false;

        this.userForm.patchValue({
          first_name: result.first_name,
          email: result.email,
          telephone: result.telephone,
          affiliation: result.affiliation,
          position: parseInt(result.position, 10),
        })
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

    if( this.userForm.invalid ) {
      this.updatingSuccess = true;
      return;
    };
    
    this.manageUsersService.updateUser(this.userName, this.userForm.value).subscribe(
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
