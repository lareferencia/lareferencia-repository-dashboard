import { Component, ElementRef, ViewChild } from '@angular/core';

import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { FileService } from './../../../core/services/file.service';
import { MessageService } from 'primeng/api';

import { ProcessStatus } from './../../../shared/enums/process-status';
import { ProcessListComponent } from './../process-list/process-list.component';

import { ProcessInfo } from '../../../shared/models/process-info.model';
import { UserInfo } from 'src/app/shared/models/user-info.model';


@Component({
  selector: 'app-upload-users',
  templateUrl: './upload-users.component.html',
  styleUrls: ['./upload-users.component.css'],
  providers:[MessageService]
})
export class UploadUsersComponent {
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild(ProcessListComponent) processListChild: ProcessListComponent; 
  file: File = null;
  users: UserInfo[] = [];
  process: ProcessInfo[] = [];
  message: string;


  constructor(
    private manageUsersService: ManageUsersService,
    private fileService: FileService,
    private messageService: MessageService
  ) {}

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  onClickClearFile() {
    this.file = null;
    this.users = this.process = [];
    this.fileInput.nativeElement.value = '';
  }


  async onChangeFileInput(): Promise<void> {
    this.users = [];
    const file: File = this.fileInput.nativeElement.files[0];

    if (!(file.size > 0)) {
      this.messageService.add({severity:'error', summary:'Error', detail:'Invalid file format'})
      throw new Error('Invalid file format');
    }

    this.file = file;
    this.fileService.readFileContent(this.file).subscribe((file: string) => {
      const lines = file.split('\n');
      const csvSeparator = ',';

      if (lines[0].split(',').length != 6) {
        this.messageService.add({severity:'error', summary:'Error', detail:'Invalid file format'})
        throw new Error('Invalid file format');

      }

      lines.forEach((element, index) => {
        const cols: string[] = element.split(csvSeparator);
        if (index > 0 && cols.length > 1) {
          if (isNaN(parseInt(cols[4])) || parseInt(cols[4]) < 0 || parseInt(cols[4]) > 5) {
            this.messageService.add({severity:'error', summary:'Error', detail:'Invalid file format'})
            throw new Error('Invalid file format');
          }

          this.users.push({
            username: cols[0],
            first_name: cols[1],
            last_name: '',
            email: cols[2],
            telephone: cols[3],
            position: parseInt(cols[4]),
            affiliation: cols[5],
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
