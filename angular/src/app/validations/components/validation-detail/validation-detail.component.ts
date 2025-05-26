import { Component, Input } from '@angular/core';

import { Rule } from 'src/app/shared/models/rule.model';

@Component({
  selector: 'app-validation-detail',
  templateUrl: './validation-detail.component.html',
  styleUrls: ['./validation-detail.component.css' ]
})
export class ValidationDetailComponent {
  @Input() dialogData: Rule;
  
}
