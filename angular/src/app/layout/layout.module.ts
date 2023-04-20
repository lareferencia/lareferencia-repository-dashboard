import { NgModule } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { DrawerComponent } from './drawer/drawer.component';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';


@NgModule({
  declarations: [
    HeaderComponent,
    DrawerComponent,
  ],
  imports: [
    MaterialModule,
    MenuModule,
    CommonModule
  ],
  exports: [ HeaderComponent, DrawerComponent ],
})
export class LayoutModule {}
