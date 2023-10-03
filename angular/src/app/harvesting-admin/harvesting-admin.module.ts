import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MainComponent } from "./pages/main.component";
import { HarvestingAdminRoutingModule } from "./harvesting-admin-routing.module";


@NgModule({
    declarations: [
        MainComponent
    ],
    imports: [
        CommonModule,
        HarvestingAdminRoutingModule
    ],
})

export class HarvestingAdminModule {}