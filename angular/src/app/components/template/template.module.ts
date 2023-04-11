import { NavComponent } from './nav/nav.component';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MenuModule } from 'primeng/menu';
import { DrawerComponent } from './drawer/drawer.component';
import { HeaderComponent } from './header/header.component';


@NgModule({
  declarations: [
    NavComponent,
    HeaderComponent,
    DrawerComponent,
  ],
  imports: [
    SharedModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatButtonModule,
    MenuModule,
  ],
  exports: [ NavComponent, HeaderComponent, DrawerComponent ],
})
export class TemplateModule {}
