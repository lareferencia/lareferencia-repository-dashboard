import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';

const routes: Routes = [
  {
    path: 'profile',
    component: MainComponent,
  },
  {
    path:'**',
    redirectTo: 'profile'
  }
]
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class ProfileRoutingModule { }
