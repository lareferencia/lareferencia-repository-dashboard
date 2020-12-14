import { ValidationService } from '../../../core/services/validation.service';
import { Occurence } from 'src/app/shared/models/occurrence.model';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { InvalidOccurenceTableDataSource } from './invalid-occurence-table-datasource';
import { Rule } from 'src/app/shared/models/rule.model';

@Component({
  selector: 'app-invalid-occurence-table',
  templateUrl: './invalid-occurence-table.component.html',
  styleUrls: ['./invalid-occurence-table.component.css'],
})
export class InvalidOccurenceTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Occurence>;
  @ViewChild('value') value: any;
  @ViewChild('count') count: any;
  @Input() rule: Rule;
  dataSource: InvalidOccurenceTableDataSource;
  displayedColumns = ['value', 'count'];
  csvData: Occurence[];
  headerData: any[];

  constructor(private validationService: ValidationService) {}

  ngOnInit() {
    this.validationService
      .getInValidOccurrencesByHarvestingIDRuleID(
        this.rule.acronym,
        this.rule.harvestingID,
        this.rule.ruleID
      )
      .subscribe((result) => {
        this.csvData = result;
        this.headerData = [
          this.value._elementRef.nativeElement.innerText,
          this.count._elementRef.nativeElement.innerText,
        ];
        this.dataSource = new InvalidOccurenceTableDataSource(result);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }
}
