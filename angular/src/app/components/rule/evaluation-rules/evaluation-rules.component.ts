import { Component, OnInit, Inject, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatButtonToggle, MatButtonToggleChange } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Record } from '../../../shared/models/record.model';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-evaluation-rules',
  templateUrl: './evaluation-rules.component.html',
  styleUrls: ['./evaluation-rules.component.css'],
})
export class EvaluationRulesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatButtonToggle) toggleFilter: MatButtonToggle;
  record: Record;
  originalRecord: Record;
  redToggle = true;
  yellowToggle = true;
  greenToggle = true;
  selectedToggle = ['red', 'yellow', 'green'];

  constructor(
    @Inject(MAT_DIALOG_DATA) data: Record,
    private authenticationService: AuthenticationService,
    private cdr: ChangeDetectorRef
  ) {
    this.originalRecord = { ...data };
    this.record = data;
  }

  ngOnInit(): void {
    if (!this.authenticationService.isAdmUser()) {
      this.yellowToggle = this.greenToggle = false;
      this.selectedToggle = ['red'];
    }
  }

  ngAfterViewInit(): void {
    this.filter(this.toggleFilter);
    this.cdr.detectChanges();
  }

  getRule(ruleID: string) {
    return this.record.rules.find((x) => x.ruleID === Number(ruleID));
  }

  toggleChange(event: MatButtonToggleChange) {
    this.filter(event.source);
  }

  filter(toggle: MatButtonToggle) {
    this.record = { ...this.originalRecord };
    this.redToggle = this.yellowToggle = this.greenToggle = false;

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
}
