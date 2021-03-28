import { ProcessStatus } from './../../../shared/enums/process-status';
import { ProcessListComponent } from './../process-list/process-list.component';
import { ProcessInfo } from '../../../shared/models/process-info.model';
import { FileService } from './../../../core/services/file.service';
import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { UserInfo } from 'src/app/shared/models/user-info.model';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-upload-users',
  templateUrl: './upload-users.component.html',
  styleUrls: ['./upload-users.component.css'],
})
export class UploadUsersComponent {
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('snackBarTemplate') snackBarTemplate: TemplateRef<any>;
  @ViewChild(ProcessListComponent) processListChild: ProcessListComponent; 
  file: File = null;
  users: UserInfo[] = [];
  process: ProcessInfo[] = [];
  message: string;
  config: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
    panelClass: ['msg-error']
  };

  constructor(
    private manageUsersService: ManageUsersService,
    private fileService: FileService,
    private snackBar: MatSnackBar
  ) {}

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  onClickClearFile() {
    this.file = null;
    this.users = this.process = [];
    this.fileInput.nativeElement.value = '';
  }

  dismissSnackbar(): void {
    this.snackBar.dismiss();
  }

  async onChangeFileInput(): Promise<void> {
    this.users = [];
    const file: File = this.fileInput.nativeElement.files[0];

    if (!(file.size > 0)) {
      this.snackBar.openFromTemplate(this.snackBarTemplate, this.config);
      throw new Error('Invalid file format');
    }

    this.file = file;
    this.fileService.readFileContent(this.file).subscribe((file: string) => {
      const lines = file.split('\n');
      const csvSeparator = ',';

      if (lines[0].split(',').length != 14) {
        this.snackBar.openFromTemplate(this.snackBarTemplate, this.config);
        throw new Error('Invalid file format');
      }

      lines.forEach((element, index) => {
        const cols: string[] = element.split(csvSeparator);
        if (index > 0 && cols.length > 1) {
          this.users.push({
            username: cols[0],
            first_name: cols[1],
            last_name: '',
            email: cols[11],
            institution_name: cols[2],
            institution_acronym: cols[3],
            institution_type: cols[4],
            institution_cnpj: cols[5],
            institution_code: cols[6],
            state: cols[7],
            source_type: cols[8],
            responsible_name: cols[9],
            telephone: cols[10],
            source_url: cols[11],
            source_oai_url: cols[12],
            password: cols[0],
          });

          this.process.push({ description: cols[0] });
        }
      });

      this.manageUsers(this.users);
    });
  }

  private manageUsers(users: UserInfo[]) {
    users.forEach((user) => {
      this.manageUsersService.getUser(user.username).subscribe(
        () => {
          this.manageUsersService.updateUser(user.username, user).subscribe(
            (result) => this.processListChild.onUpdateStatus({description: user.username, status: result ? ProcessStatus.Success: ProcessStatus.Error}),
            () => this.processListChild.onUpdateStatus({description: user.username, status: ProcessStatus.Error})
          );
        },
        () => {
          this.manageUsersService.createUser(user).subscribe(
            (result) => this.processListChild.onUpdateStatus({description: user.username, status: result ? ProcessStatus.Success: ProcessStatus.Error}),
            () => this.processListChild.onUpdateStatus({description: user.username, status: ProcessStatus.Error})
          );
        }
      );
    });
  }
}
