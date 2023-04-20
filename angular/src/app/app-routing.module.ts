import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationService } from './core/services/authentication.service';
import { AccountComponent } from './components/account/account/account.component';
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
    path: ':acronym',
    loadChildren: () => import('./validations/validations.module').then(m => m.ValidationsModule),
    canActivate: [AuthenticationService],
  },
  {
    path: ':acronym',
    loadChildren: () => import('./harvesting/harvesting.module').then(m => m.HarvestingModule),
    canActivate: [AuthenticationService],
  },
  {
    path: 'manage/accounts',
    component: AccountComponent,
    canActivate: [AuthenticationService],
    data: { roles: ['dashboard-admin'] },
  },
  {
    path:'**',
    redirectTo: '',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
