import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ManageUsersService } from 'src/app/core/services/manage-users.service';


import { MessageService } from 'primeng/api';
import { PositionType } from 'src/app/shared/enums/user-position';


interface PositionOptions{
  label: string,
  value: PositionType
}

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css'],
  providers: [MessageService]
})
export class UserCreateComponent implements OnInit  {

  public loading = false;
  public positions: PositionOptions[];
  public userCreateForm: FormGroup;


  constructor(
    private manageUsersService: ManageUsersService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.userCreateForm = this.fb.group({
      username: [null, [Validators.required, Validators.minLength(2)]],
      first_name: [null],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      telephone: [null],
      affiliation: [null],
      position: [null],
    })
  }

  ngOnInit(): void {
      this.positions = [
        { label: 'Node Administrator', value: PositionType.NodeAdministrator },
        { label: 'Assistant/Auxiliary', value: PositionType.AssistantAuxiliary },
        { label: 'Librarian', value: PositionType.Librarian },
        { label: 'Repository Manager', value: PositionType.RepositoryManager },
        { label: 'Technical Responsible', value: PositionType.TechnicalResponsible }
      ];
  }

  isValidField(field: string): boolean{
    return this.userCreateForm.controls[field].hasError('required')
      && this.userCreateForm.controls[field].touched;
  }

  onClickSave() {
    this.loading = true;
    this.userCreateForm.markAllAsTouched();

    if(this.userCreateForm.invalid){
      this.loading = false;
      return;
    }
    this.manageUsersService.createUser(this.userCreateForm.value).subscribe(
      (result) => this.resultHandler(result),
         () => this.resultHandler(false));
  }

  private resultHandler(success: boolean) {
    this.loading = false
    if (success) {
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
