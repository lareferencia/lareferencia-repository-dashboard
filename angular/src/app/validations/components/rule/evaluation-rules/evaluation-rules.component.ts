import { Component, OnInit, Input } from '@angular/core';

import { Record } from 'src/app/shared/models/record.model';
import { DialogData } from 'src/app/validations/interfaces/dialogData.interface';

@Component({
  selector: 'app-evaluation-rules',
  templateUrl: './evaluation-rules.component.html',
  styleUrls: ['./evaluation-rules.component.css'],
})
export class EvaluationRulesComponent implements OnInit {

  @Input() dialogData: DialogData; 
  public record: Record;
  public acronym: string;

  constructor() {}

  ngOnInit(): void {
    this.record = this.dialogData.record;
    this.acronym = this.dialogData.acronym;

  }

  getRule(ruleID: string) {
    return this.record.rules.find((x) => x.ruleID === Number(ruleID));
  }

}
