import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  showMessage(msg: string, type: string = 'success'): void {
    this.snackBar.open(msg, 'X', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass:
        type === 'success'
          ? ['msg-success']
          : type === 'error'
          ? ['msg-error']
          : ['msg-warning'],
    });
  }
}
