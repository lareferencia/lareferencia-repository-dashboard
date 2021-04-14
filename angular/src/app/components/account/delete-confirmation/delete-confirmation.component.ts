import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.css'],
})
export class DeleteConfirmationComponent {
  username: string;
  type: string;

  constructor(@Inject(MAT_DIALOG_DATA) data: {type: string, description: string}) {
    this.username = data.description;
    this.type = data.type;
  }
}
