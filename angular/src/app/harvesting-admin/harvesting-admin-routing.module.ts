import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./pages/main.component";
import { NgModule } from "@angular/core";
import { NetworkEditorComponent } from "./pages/components/network-editor/network-editor.component";

const routes: Routes = [
    {
        path: 'harvesting-admin',
        component: MainComponent
    },
    {
        path: ':id',
        component: NetworkEditorComponent
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