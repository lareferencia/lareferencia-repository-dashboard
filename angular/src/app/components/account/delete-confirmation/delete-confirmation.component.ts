import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
})
export class DeleteConfirmationComponent {
  username: string;

  constructor(@Inject(MAT_DIALOG_DATA) data: string) {
    this.username = data;
  }
}
