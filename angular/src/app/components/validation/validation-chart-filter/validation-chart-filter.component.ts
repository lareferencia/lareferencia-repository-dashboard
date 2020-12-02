import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-validation-chart-filter',
  templateUrl: './validation-chart-filter.component.html',
  styleUrls: ['./validation-chart-filter.component.css'],
})
export class ValidationChartFilterComponent {
  @Output() applyFilter = new EventEmitter<FormGroup>();
  @Output() applyClear = new EventEmitter();
  @Input() date: FormGroup;

  public filterClick() {
    this.applyFilter.emit(this.date);
  }

  public clearClick() {
    this.applyClear.emit();
  }
}
