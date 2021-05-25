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
import { GroupsComponent } from './groups/groups.component';
import { GroupSyncComponent } from './group-sync/group-sync.component';
import { GroupTableComponent } from './group-table/group-table.component';
import { UserGroupComponent } from './user-group/user-group.component';
import { UserGroupTableComponent } from './user-group-table/user-group-table.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { MatSelectModule } from '@angular/material/select';
import { GroupCreateComponent } from './group-create/group-create.component';

@NgModule({
  declarations: [
    UploadUsersComponent,
    ProcessListComponent,
    AccountComponent,
    UsersComponent,
    UserTableComponent,
    DeleteConfirmationComponent,
    GroupsComponent,
    GroupSyncComponent,
    GroupTableComponent,
    UserGroupComponent,
    UserGroupTableComponent,
    UserCreateComponent,
    GroupCreateComponent,
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
    MatSelectModule,
  ],
})
export class AccountModule {}
