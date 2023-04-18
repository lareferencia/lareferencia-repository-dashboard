import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HarvestingComponent } from '../components/harvesting/harvesting/harvesting.component';

const routes: Routes = [
    {
        path:'harvesting',
        component: HarvestingComponent,
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HarvestingRoutingModule { }
