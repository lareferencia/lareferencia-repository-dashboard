import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';
import { HomeComponent } from './home.component';




@NgModule({
  declarations: [HomeComponent],
  imports: [
    MaterialModule,
    SharedModule,
  ],
})
export class HomeModule {}
