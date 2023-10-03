import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationService } from './core/services/authentication.service';
import { HomeComponent } from './home/home.component';
import { canActivateGuard } from './core/guards/activate-modules.guard';

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
    canActivate: [AuthenticationService, canActivateGuard],
    data:{module: 'validation_module'}
  },
  {
    path: ':acronym/harvesting',
    loadChildren: () => import('./harvesting/harvesting.module').then(m => m.HarvestingModule),
    canActivate: [AuthenticationService, canActivateGuard],
    data:{module: 'historic_module'}
  },{
    path: 'statistics',
    loadChildren: () => import('./statistics/statistics.module').then(m => m.StatisticsModule),
    canActivate: [AuthenticationService, canActivateGuard],
    data:{module: 'statistics_module'}
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthenticationService],
    data: { roles: ['dashboard-admin'] },
  },
  {
    path: 'harvesting-admin',
    loadChildren: () => import('./harvesting-admin/harvesting-admin.module').then(m => m.HarvestingAdminModule),
    canActivate: [AuthenticationService, canActivateGuard],
    data: {module: 'harvesting_admin_module'}
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
