import { HarvestingService } from 'src/app/core/services/harvesting.service';
import { Component, OnInit, Inject, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatButtonToggle, MatButtonToggleChange } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Record } from 'src/app/shared/models/record.model';

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
  xml: string;
  acronym: string;
  isAdmUser = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private authenticationService: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private service: HarvestingService,
  ) {
    this.originalRecord = { ...data.record };
    this.record = data.record;
    this.acronym = data.acronym;
  }

  ngOnInit(): void {
    if (!(this.isAdmUser = this.authenticationService.isAdmUser())) {
      this.yellowToggle = this.greenToggle = false;
      this.selectedToggle = ['red'];
    }
    this.service.getMetadataXml(this.acronym, this.record.id).subscribe(result=> {
      this.xml = result;
    })
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
