import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { PrimengMaterial } from '../primeng-material/primeng-material.module';


import { MainComponent } from './pages/main.component';
import { UploadUsersComponent } from './components/upload-users/upload-users.component';
import { ProcessListComponent } from './components/process-list/process-list.component';
import { AccountComponent } from './components/account/account.component';
import { UsersComponent } from './components/users/users.component';
import { UserTableComponent } from './components/user-table/user-table.component';
import { GroupsComponent } from './components/groups/groups.component';
import { GroupSyncComponent } from './components/group-sync/group-sync.component';
import { GroupTableComponent } from './components/group-table/group-table.component';
import { UserGroupComponent } from './components/user-group/user-group.component';
import { UserGroupTableComponent } from './components/user-group-table/user-group-table.component';
import { UserCreateComponent } from './components/user-create/user-create.component';
import { GroupCreateComponent } from './components/group-create/group-create.component';

@NgModule({
    declarations: [
      MainComponent,
      UploadUsersComponent,
      ProcessListComponent,
      AccountComponent,
      UsersComponent,
      UserTableComponent,
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
      PrimengMaterial,
      ReactiveFormsModule

    ],
    exports:[
      AccountComponent
    ]
})
export class AdminModule {}