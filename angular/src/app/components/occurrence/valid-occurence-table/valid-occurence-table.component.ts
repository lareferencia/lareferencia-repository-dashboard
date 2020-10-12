import { ValidationService } from 'src/app/services/validation.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ValidOccurenceTableDataSource } from './valid-occurence-table-datasource';
import { Occurence } from 'src/app/shared/occurrence.model';
import { Rule } from 'src/app/shared/rule.model';

@Component({
  selector: 'app-valid-occurence-table',
  templateUrl: './valid-occurence-table.component.html',
  styleUrls: ['./valid-occurence-table.component.css'],
})
export class ValidOccurenceTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Occurence>;
  @Input() rule: Rule;
  dataSource: ValidOccurenceTableDataSource;
  displayedColumns = ['value', 'count'];
  csvData: Occurence[];

  constructor(private validationService: ValidationService) {}

  ngOnInit() {
    this.validationService
      .getValidOccurrencesByHarvestingIDRuleID(
        this.rule.harvestingID,
        this.rule.ruleID
      )
      .subscribe((result) => {
        this.csvData = result;
        this.dataSource = new ValidOccurenceTableDataSource(result);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }
}
