import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './home.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PrimengMaterial } from '../primeng-material/primeng-material.module';




@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    PrimengMaterial,
    SharedModule,
    RouterModule
  ],
})
export class HomeModule {}
