import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./pages/main.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
        path: 'harvesting-admin',
        component: MainComponent
    },
    {
        path: '**',
        redirectTo: 'harvesting-admin'
    }
]
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
})

export class HarvestingAdminRoutingModule {}