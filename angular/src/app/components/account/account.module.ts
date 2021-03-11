import { UploadUsersComponent } from './upload-users/upload-users.component';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { UserListComponent } from './user-list/user-list.component';
import { AccountComponent } from './account/account.component';
import { UsersComponent } from './users/users.component';

@NgModule({
  declarations: [
    UploadUsersComponent,
    UserListComponent,
    AccountComponent,
    UsersComponent,
  ],
  imports: [
    SharedModule,
    MatButtonModule,
    MatTabsModule,
    MatExpansionModule,
  ],
})
export class AccountModule {}
