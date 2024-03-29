import { NgModule } from "@angular/core";

import { SharedModule } from "src/app/shared/shared.module";

// import { RecordValidComponent } from "./record-valid/record-valid.component";
import { RecordInvalidComponent } from "./record-invalid/record-invalid.component";
// import { RecordsValidTableComponent } from "./records-valid-table/records-valid-table.component";
import { RecordsInvalidTableComponent } from "./records-invalid-table/records-invalid-table.component";
import { RecordsTableComponent } from "./records-table/records-table.component";
import { RuleModule } from "../rule/rule.module";
import { PrimengMaterial } from "src/app/primeng-material/primeng-material.module";


@NgModule({
  declarations: [
    // RecordValidComponent,
    RecordInvalidComponent,
    // RecordsValidTableComponent,
    RecordsInvalidTableComponent,
    RecordsTableComponent,
  ],
  imports: [
    SharedModule,
    PrimengMaterial,
    RuleModule
  ],
  exports: [
    // RecordValidComponent,
    RecordInvalidComponent,
    // RecordsValidTableComponent,
    RecordsInvalidTableComponent,
    RecordsTableComponent,
  ],
})
export class RecordModule {}
