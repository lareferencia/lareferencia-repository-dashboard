import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationService } from './core/services/authentication.service';
import { HomeComponent } from './home/home.component';
import { canActivateGuard } from './core/guards/activate-modules.guard';
import { LoginComponent } from './auth/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    canActivateChild: [AuthenticationService],
    children: [
      { path: '', component: HomeComponent },
      {
        path: 'user',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
      },
      {
        path: ':acronym/validation',
        loadChildren: () => import('./validations/validations.module').then(m => m.ValidationsModule),
        canActivate: [canActivateGuard],
        data: { module: 'validation_module' },
      },
      {
        path: ':acronym/harvesting',
        loadChildren: () => import('./harvesting/harvesting.module').then(m => m.HarvestingModule),
        canActivate: [canActivateGuard],
        data: { module: 'historic_module' },
      },
      {
        path: 'statistics',
        loadChildren: () => import('./statistics/statistics.module').then(m => m.StatisticsModule),
        canActivate: [canActivateGuard],
        data: { module: 'statistics_module' },
      },
    ],
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
