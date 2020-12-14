import { MatCardModule } from '@angular/material/card';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [SharedModule, MatCardModule],
})
export class HomeModule {}
