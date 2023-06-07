import { Component, Input } from '@angular/core';
import { Record } from '../../models/record.model';

@Component({
  selector: 'app-rule-card',
  templateUrl: './rule-card.component.html',
  styleUrls: ['./rule-card.component.css']
})
export class RuleCardComponent {

  @Input() quantifier: string;
  @Input() name: string;
  @Input() rule: string;
  @Input() record: Record;
  @Input() mandatory: boolean;
  @Input() colorCard: string;
  @Input() toolTipDescription: string;

}
