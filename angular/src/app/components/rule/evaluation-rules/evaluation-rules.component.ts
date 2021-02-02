import { Component, OnInit, Inject } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Record } from '../../../shared/models/record.model';

@Component({
  selector: 'app-evaluation-rules',
  templateUrl: './evaluation-rules.component.html',
  styleUrls: ['./evaluation-rules.component.css'],
})
export class EvaluationRulesComponent implements OnInit {
  record: Record;
  originalRecord: Record;
  redToggle = true;
  yellowToggle = true;
  greenToggle = true;

  constructor(@Inject(MAT_DIALOG_DATA) data: Record) {
    this.originalRecord = { ...data };
    this.record = data;
  }

  getRule(ruleID: string) {
    return this.record.rules.find((x) => x.ruleID === Number(ruleID));
  }

  toggleChange(event: MatButtonToggleChange) {
    this.record = { ...this.originalRecord };
    this.redToggle = this.yellowToggle = this.greenToggle = false;
    let toggle = event.source;

    if (toggle) {
      let group = toggle.buttonToggleGroup;

      if (!group.value.some((x: string) => x == 'green'))
        this.record.validRulesID = [];

      if (!group.value.some((x: string) => x == 'red')) {
        if (group.value.some((x: string) => x == 'yellow')) {
          this.record.invalidRulesID = this.record.invalidRulesID.filter(
            (x) => !this.getRule(x).mandatory
          );
        } else {
          this.record.invalidRulesID = [];
        }
      }

      if (!group.value.some((x: string) => x == 'yellow')) {
        this.record.invalidRulesID = this.record.invalidRulesID.filter(
          (x) => this.getRule(x).mandatory
        );
      }

      group.value.forEach((element: string) => {
        switch (element) {
          case 'red':
            this.redToggle = true;
            break;
          case 'yellow':
            this.yellowToggle = true;
            break;
          case 'green':
            this.greenToggle = true;
            break;
        }
      });
    } else {
      this.record.validRulesID = [];
      this.record.invalidRulesID = [];
    }
  }

  ngOnInit(): void {}
}
