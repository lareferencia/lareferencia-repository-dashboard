import { ActivatedRoute } from '@angular/router';
import { ValidationService } from 'src/app/core/services/validation.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ValidOccurenceTableDataSource } from './valid-occurence-table-datasource';
import { Occurence } from 'src/app/shared/models/occurrence.model';
import { Rule } from 'src/app/shared/models/rule.model';

@Component({
  selector: 'app-valid-occurence-table',
  templateUrl: './valid-occurence-table.component.html',
  styleUrls: ['./valid-occurence-table.component.css'],
})
export class ValidOccurenceTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Occurence>;
  @ViewChild('value') value: any;
  @ViewChild('count') count: any;
  @Input() rule: Rule;
  dataSource: ValidOccurenceTableDataSource;
  displayedColumns = ['value', 'count'];
  csvData: Occurence[];
  headerData: any[];

  constructor(private validationService: ValidationService, private route: ActivatedRoute) {}

  ngOnInit() {
    const acronym = this.route.snapshot.paramMap.get('acronym');

    this.validationService
      .getValidOccurrencesByHarvestingIDRuleID(
        acronym,
        this.rule.harvestingID,
        this.rule.ruleID
      )
      .subscribe((result) => {
        this.csvData = result;
        this.headerData = [
          this.value._elementRef.nativeElement.innerText,
          this.count._elementRef.nativeElement.innerText,
        ];
        this.dataSource = new ValidOccurenceTableDataSource(result);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }
}
