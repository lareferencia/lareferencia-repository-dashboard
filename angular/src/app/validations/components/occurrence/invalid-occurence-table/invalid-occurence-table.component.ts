import { Occurence } from 'src/app/shared/models/occurrence.model';
import { Component, OnInit, Input } from '@angular/core';
import { InvalidOccurenceTableDataSource } from './invalid-occurence-table-datasource';
import { Rule } from 'src/app/shared/models/rule.model';
import { ValidationService } from 'src/app/core/services/validation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-invalid-occurence-table',
  templateUrl: './invalid-occurence-table.component.html',
  styleUrls: ['./invalid-occurence-table.component.css'],
})
export class InvalidOccurenceTableComponent implements OnInit {

  @Input() rule: Rule;


  isLoading = true;
  dataSource: any;
  displayedColumns = ['value', 'count'];
  csvData: Occurence[];
  headerData: any[];
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
        // this.headerData = [
        //   this.value._elementRef.nativeElement.innerText,
        //   this.count._elementRef.nativeElement.innerText,
        // ];
        this.dataSource = result;
      });
  }
}
