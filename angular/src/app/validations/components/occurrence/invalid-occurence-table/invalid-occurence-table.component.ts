import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { ValidationService } from 'src/app/core/services/validation.service';

import { Occurence } from 'src/app/shared/models/occurrence.model';
import { Rule } from 'src/app/shared/models/rule.model';

@Component({
  selector: 'app-invalid-occurence-table',
  templateUrl: './invalid-occurence-table.component.html',
  styleUrls: ['./invalid-occurence-table.component.css'],
})
export class InvalidOccurenceTableComponent implements OnInit {

  @Input() rule: Rule;


  public isLoading = true;
  public dataSource: any;
  public displayedColumns = ['value', 'count'];
  public csvData: Occurence[];
  public headerData: any[];
  private subscription: Subscription;

  constructor(private validationService: ValidationService) {}

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

  loadData(){
    this.isLoading = true;
    this.subscription = this.validationService
      .getInValidOccurrencesByHarvestingIDRuleID(
        this.rule.acronym,
        this.rule.harvestingID,
        this.rule.ruleID
      )
      .subscribe((result) => {
        this.isLoading = false;
        this.csvData = result;
        this.headerData = ['Ocurrence','Amount'];
        this.dataSource = result;
      });
  }
}
