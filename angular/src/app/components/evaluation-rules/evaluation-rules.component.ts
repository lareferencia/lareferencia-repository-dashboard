import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Record } from 'src/app/shared/record.model';

@Component({
  selector: 'app-evaluation-rules',
  templateUrl: './evaluation-rules.component.html',
  styleUrls: ['./evaluation-rules.component.css'],
})
export class EvaluationRulesComponent implements OnInit {
  record: Record;

  constructor(@Inject(MAT_DIALOG_DATA) data: Record) {
    this.record = data;
  }

  getRule(ruleID: string) {
    return this.record.rules.find((x) => x.ruleID === Number(ruleID));
  }

  ngOnInit(): void {}
}
