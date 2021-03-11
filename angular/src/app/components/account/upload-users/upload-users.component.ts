import { FileService } from './../../../core/services/file.service';
import { CreateStatus } from './../../../shared/enums/create-status';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { UserInfo } from 'src/app/shared/models/user-info.model';

@Component({
  selector: 'app-upload-users',
  templateUrl: './upload-users.component.html',
  styleUrls: ['./upload-users.component.css'],
})
export class UploadUsersComponent {
  @ViewChild('fileInput') fileInput: ElementRef;
  file: File = null;
  users: UserInfo[] = [];

  constructor(
    private manageUsersService: ManageUsersService,
    private fileService: FileService
  ) {}

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  async onChangeFileInput(): Promise<void> {
    const file: File = this.fileInput.nativeElement.files[0];

    if (!(file.size > 0)) {
      const message = 'Invalid file format';
      alert(message);
      throw new Error(message);
    }

    this.file = file;
    this.fileService.readFileContent(this.file).subscribe((file: string) => {
      const lines = file.split('\n');
      const csvSeparator = ',';

      if (lines[0].split(',').length != 14) {
        const message = 'Invalid file format.';
        alert(message);
        throw new Error(message);
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
            created_status: CreateStatus.Processing,
          });
        }
      });

      this.manageUsers(this.users);
    });
  }

  private manageUsers(users: UserInfo[]) {
    users.forEach((user) => {
      this.manageUsersService.createUser(user).subscribe(
        (x) => {
          if (x == true)
            this.users.find(
              (x) => x.username === user.username
            ).created_status = CreateStatus.Success;
        },
        () => {
          this.users.find((x) => x.username === user.username).created_status =
            CreateStatus.Error;
        }
      );
    });
  }
}
