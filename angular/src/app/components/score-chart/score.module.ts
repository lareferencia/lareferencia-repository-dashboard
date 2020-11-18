import { ScoreChartComponent } from './score-chart.component';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ScoreChartComponent],
  imports: [SharedModule],
})
export class ScoreModule {}
