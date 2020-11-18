import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NavComponent } from './nav/nav.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    NavBarComponent,
    NavComponent,
    FooterComponent,
    HeaderComponent,
  ],
  imports: [
    SharedModule,
    MatToolbarModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
  ],
  exports: [NavBarComponent, NavComponent, FooterComponent, HeaderComponent],
})
export class TemplateModule {}
