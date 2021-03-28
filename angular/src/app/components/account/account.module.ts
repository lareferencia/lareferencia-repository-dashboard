import { UploadUsersComponent } from './upload-users/upload-users.component';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { ProcessListComponent } from './process-list/process-list.component';
import { AccountComponent } from './account/account.component';
import { UsersComponent } from './users/users.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UserTableComponent } from './user-table/user-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    UploadUsersComponent,
    ProcessListComponent,
    AccountComponent,
    UsersComponent,
    UserTableComponent,
    DeleteConfirmationComponent,
  ],
  imports: [
    SharedModule,
    MatButtonModule,
    MatTabsModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatInputModule,
  ],
})
export class AccountModule {}
