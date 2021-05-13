import { MatCardModule } from '@angular/material/card';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './home/home.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [HomeComponent, UserInfoComponent],
  imports: [SharedModule, MatCardModule, MatInputModule],
})
export class HomeModule {}
