import { MatCardModule } from '@angular/material/card';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './home/home.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [HomeComponent, UserInfoComponent],
  imports: [
    SharedModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
})
export class HomeModule {}
