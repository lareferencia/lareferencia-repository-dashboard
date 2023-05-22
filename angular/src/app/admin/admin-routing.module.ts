import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main.component';

const routes: Routes = [
  {
    path: 'accounts',
    component: MainComponent,
  },
  {
    path:'**',
    redirectTo: 'accounts'
  }
]
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
