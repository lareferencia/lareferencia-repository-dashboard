import { DateFilter } from './../../../shared/models/date-filter.model';
import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-validation-chart-filter',
  templateUrl: './validation-chart-filter.component.html',
  styleUrls: ['./validation-chart-filter.component.css'],
})
export class ValidationChartFilterComponent {
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
