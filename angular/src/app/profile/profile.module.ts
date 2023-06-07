import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { PrimengMaterial } from '../primeng-material/primeng-material.module';
import { SharedModule } from '../shared/shared.module';

import { MainComponent } from './pages/main/main.component';
import { UserInfoComponent } from './components/user-info/user-info.component';


@NgModule({
  declarations: [
    MainComponent,
    UserInfoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ProfileRoutingModule,
    PrimengMaterial,
  ]
})
export class ProfileModule { }
