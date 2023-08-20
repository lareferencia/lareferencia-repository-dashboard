import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main.component';

const routes: Routes = [
  {
    path: 'statistics',
    component: MainComponent,
  },
  {
    path:'**',
    redirectTo: 'statistics'
  }
]
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class StatisticsRoutingModule { }
