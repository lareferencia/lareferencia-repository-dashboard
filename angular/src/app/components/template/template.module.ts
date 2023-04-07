import { NavComponent } from './nav/nav.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    NavBarComponent,
    NavComponent,
  ],
  imports: [
    SharedModule,
    MatToolbarModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatButtonModule,
  ],
  exports: [NavBarComponent, NavComponent ],
})
export class TemplateModule {}
