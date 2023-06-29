import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationService } from './core/services/authentication.service';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthenticationService],
  },
  {
    path:'user',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthenticationService],
  },
  {
    path: ':acronym/validation',
    loadChildren: () => import('./validations/validations.module').then(m => m.ValidationsModule),
    canActivate: [AuthenticationService],
  },
  {
    path: ':acronym/harvesting',
    loadChildren: () => import('./harvesting/harvesting.module').then(m => m.HarvestingModule),
    canActivate: [AuthenticationService],
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthenticationService],
    data: { roles: ['dashboard-admin'] },
  },
  {
    path:'**',
    redirectTo: '',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: "top" 
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
