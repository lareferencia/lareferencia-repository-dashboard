import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-validation-card',
  templateUrl: './validation-card.component.html',
  styleUrls: ['./validation-card.component.css']
})
export class ValidationCardComponent {

  @Input() title: string;
  @Input() validationTitle: string;
  @Input() icon: string;
  @Input() color: string;
  @Input() validationData: number;
  @Input() imagePath: string;
  @Input() shadowColor: string;
}
