import { RecordsFilter } from './../../../shared/records-filter.model';
import { AfterViewInit, Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { RecordsTableDataSource } from './records-table-datasource';
import { Validation } from 'src/app/shared/validation.model';
import { Record } from 'src/app/shared/record.model';
import { ValidationService } from 'src/app/services/validation.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { startWith } from 'rxjs/internal/operators/startWith';
import { tap } from 'rxjs/internal/operators/tap';
import { EvaluationRulesComponent } from '../../evaluation-rules/evaluation-rules.component';

@Component({
  selector: 'app-records-table',
  templateUrl: './records-table.component.html',
  styleUrls: ['./records-table.component.css'],
})
export class RecordsTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Record>;
  @ViewChild('id') id : ElementRef<HTMLTableHeaderCellElement>;
  @ViewChild('identifier') identifier : ElementRef<HTMLTableHeaderCellElement>;
  @ViewChild('isValid') isValid : ElementRef<HTMLTableHeaderCellElement>;
  @ViewChild('isTransformed') isTransformed : ElementRef<HTMLTableHeaderCellElement>;
  @Input() validation: Validation;
  dataSource: RecordsTableDataSource;
  pageSize = 10;
  harvestingID: number;
  acronym: string;
  isLoadingResults = true;
  csvData: any[];
  headerData: any[];

  filter: RecordsFilter = {
    pageSize: this.pageSize,
    pageNumber: 0,
  };

  displayedColumns = [
    'id',
    'identifier',
    'isValid',
    'isTransformed',
    'button-detail',
  ];

  constructor(
    private validationService: ValidationService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.harvestingID = Number(
      this.route.snapshot.paramMap.get('harvestingID')
    );
    this.acronym = this.route.snapshot.paramMap.get('acronym');
  }

  detailClick(record: Record): void {
    record.rules = this.validation.rulesByID;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = record;
    dialogConfig.autoFocus = false;

    this.dialog.open(EvaluationRulesComponent, dialogConfig);
  }

  clearFilter() {
    this.filter = {};
    this.applyFilter();
  }

  applyFilter() {
    this.paginator.pageIndex = 0;
    this.loadRecords();
  }

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        startWith(null),
        tap(() => {
          this.loadRecords();
        })
      )
      .subscribe(() => {});
  }

  loadRecords() {
    this.filter = {
      ...this.filter,
      pageSize: this.paginator.pageSize,
      pageNumber: this.paginator.pageIndex,
    };
    this.isLoadingResults = true;

    this.validationService
      .getRecordsByHarvestingIDFilter(this.acronym, this.harvestingID, this.filter)
      .subscribe((result) => {
        this.dataSource = new RecordsTableDataSource(result.content);
        this.paginator.length = result.totalElements;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoadingResults = false;

        this.csvData = result.content.map((x) => {
          return {
            id: x.id,
            identifier: x.identifier,
            validation: x.isValid,
            tranformation: x.isTransformed,
          };
        });

        this.headerData = [
          this.id.nativeElement.innerText,
          this.identifier.nativeElement.innerText,
          this.isValid.nativeElement.innerText,
          this.isTransformed.nativeElement.innerText,
        ];
      });
  }
}
