import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationService } from './core/services/authentication.service';
import { HomeComponent } from './home/home.component';
import { statistics } from 'src/environments/environment';
import { canActivateGuard, canMatchGuard } from './core/guards/statistics-module.guard';

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
  },{
    path: 'statistics',
    loadChildren: () => import('./statistics/statistics.module').then(m => m.StatisticsModule),
    canActivate: [canActivateGuard], //Anclamos la función del canActive
    canMatch: [canMatchGuard], //Anclamos la función del canMatch
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

const filteredRoutes = routes.filter(route => route !== null);


@NgModule({
  imports: [RouterModule.forRoot(filteredRoutes, {
    scrollPositionRestoration: "top" 
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
