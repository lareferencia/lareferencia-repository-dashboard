import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeleteType } from 'src/app/shared/enums/delete-type';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.css'],
})
export class DeleteConfirmationComponent {
  username: string;
  type: DeleteType;
  deleteType = DeleteType;

  constructor(@Inject(MAT_DIALOG_DATA) data: {type: DeleteType, description: string}) {
    this.username = data.description;
    this.type = data.type;
  }
}
