import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MenuModule } from 'primeng/menu';
import { DrawerComponent } from './drawer/drawer.component';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    HeaderComponent,
    DrawerComponent,
  ],
  imports: [
    MatSidenavModule,
    MatListModule,
    MenuModule,
    CommonModule
  ],
  exports: [ HeaderComponent, DrawerComponent ],
})
export class TemplateModule {}
