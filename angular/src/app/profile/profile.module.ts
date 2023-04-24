import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './pages/main/main.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { MaterialModule } from '../material/material.module';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { SharedModule } from '../shared/shared.module';





@NgModule({
  declarations: [
    MainComponent,
    UserInfoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ProfileRoutingModule,
    MaterialModule,
  ]
})
export class ProfileModule { }
