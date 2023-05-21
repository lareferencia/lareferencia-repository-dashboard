import { Component, OnInit, Input } from '@angular/core';

import { ValidationService } from 'src/app/core/services/validation.service';

import { Occurence } from 'src/app/shared/models/occurrence.model';
import { Rule } from 'src/app/shared/models/rule.model';

@Component({
  selector: 'app-valid-occurence-table',
  templateUrl: './valid-occurence-table.component.html',
  styleUrls: ['./valid-occurence-table.component.css'],
})
export class ValidOccurenceTableComponent implements OnInit {

  @Input() rule: Rule;
  
  public dataSource: any;
  public displayedColumns = ['value', 'count'];
  public csvData: Occurence[];
  public headerData: any[];
  public isLoading = true;

  constructor(private validationService: ValidationService) {}

  ngOnInit() {
    this.isLoading = true;
    this.validationService
      .getValidOccurrencesByHarvestingIDRuleID(
        this.rule.acronym,
        this.rule.harvestingID,
        this.rule.ruleID
      )
      .subscribe((result) => {
        this.isLoading = false;
        this.csvData = result;
        this.headerData = ['Ocurrence', 'Amount'];
        this.dataSource = result;
      });
  }
}
