import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimengMaterial } from '../primeng-material/primeng-material.module';

import { DrawerComponent } from './drawer/drawer.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    HeaderComponent,
    DrawerComponent,
  ],
  imports: [
    PrimengMaterial,
    CommonModule,
    FormsModule,
  ],
  exports: [ HeaderComponent, DrawerComponent ],
})
export class LayoutModule {}
