import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './pages/main.component';
import { AdminRoutingModule } from './admin-routing.module';
import { UploadUsersComponent } from './components/upload-users/upload-users.component';
import { ProcessListComponent } from './components/process-list/process-list.component';
import { AccountComponent } from './components/account/account.component';
import { UsersComponent } from './components/users/users.component';
import { UserTableComponent } from './components/user-table/user-table.component';
import { DeleteConfirmationComponent } from './components/delete-confirmation/delete-confirmation.component';
import { GroupsComponent } from './components/groups/groups.component';
import { GroupSyncComponent } from './components/group-sync/group-sync.component';
import { GroupTableComponent } from './components/group-table/group-table.component';
import { UserGroupComponent } from './components/user-group/user-group.component';
import { UserGroupTableComponent } from './components/user-group-table/user-group-table.component';
import { UserCreateComponent } from './components/user-create/user-create.component';
import { GroupCreateComponent } from './components/group-create/group-create.component';
import { SharedModule } from 'primeng/api';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
      MainComponent,
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
      CommonModule,
      FormsModule, 
      AdminRoutingModule,
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
      MatIconModule
    ],
    exports:[
      AccountComponent
    ]
})
export class AdminModule {}