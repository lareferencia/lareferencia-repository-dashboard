import { NgModule } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { ValidationChartFilterComponent } from './validation-chart-filter.component';

@NgModule({
  declarations: [ValidationChartFilterComponent],
  imports: [
    SharedModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatMomentDateModule,
  ],
  exports: [ValidationChartFilterComponent],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { strict: true } },
  ],
})
export class ValidationChartFilterModule {}
