import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material/material.module';

import { DrawerComponent } from './drawer/drawer.component';
import { HeaderComponent } from './header/header.component';


@NgModule({
  declarations: [
    HeaderComponent,
    DrawerComponent,
  ],
  imports: [
    MaterialModule,
    CommonModule
  ],
  exports: [ HeaderComponent, DrawerComponent ],
})
export class LayoutModule {}
