import { Component, Output, EventEmitter, Input } from '@angular/core';
import { DateFilter } from 'src/app/shared/models/date-filter.model';

@Component({
  selector: 'app-harvesting-chart-filter',
  templateUrl: './harvesting-chart-filter.component.html',
  styleUrls: ['./harvesting-chart-filter.component.css']
})
export class HarvestingChartFilterComponent {
  @Output() applyFilter = new EventEmitter<DateFilter>();
  @Output() applyClear = new EventEmitter();
  @Input() date: DateFilter;

  public filterClick() {
    this.applyFilter.emit(this.date);
  }

  public clearClick() {
    this.applyClear.emit();
  }
}
