import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MainComponent } from "./pages/main.component";
import { HarvestingAdminRoutingModule } from "./harvesting-admin-routing.module";
import { NetworksListTableComponent } from './pages/components/networks-list-table/networks-list-table.component';
import { PrimengMaterial } from "../primeng-material/primeng-material.module";
import { SharedModule } from "../shared/shared.module";
import { ValidatorsFormComponent } from './pages/components/validators-form/validators-form.component';


@NgModule({
    declarations: [
        MainComponent,
        NetworksListTableComponent,
        ValidatorsFormComponent
    ],
    imports: [
        CommonModule,
        HarvestingAdminRoutingModule,
        PrimengMaterial,
        SharedModule
    ],
})

export class HarvestingAdminModule {}