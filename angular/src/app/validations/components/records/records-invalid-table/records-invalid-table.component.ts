import { ActivatedRoute } from '@angular/router';
import { ValidationService } from 'src/app/core/services/validation.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { RecordsTableDataSource } from './records-invalid-table-datasource';
import { Record } from 'src/app/shared/models/record.model';
import { Validation } from 'src/app/shared/models/validation.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EvaluationRulesComponent } from '../../rule/evaluation-rules/evaluation-rules.component';
import { startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'app-records-invalid-table',
  templateUrl: './records-invalid-table.component.html',
  styleUrls: ['./records-invalid-table.component.css'],
})
export class RecordsInvalidTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Record>;
  @Input() validation: Validation;
  dataSource: RecordsTableDataSource;
  pageSize = 25;
  harvestingID: number;
  acronym: string;
  ruleID: number;
  isLoadingResults = true;
  csvData: any[];
  
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
    this.harvestingID = Number(this.route.snapshot.paramMap.get('harvestingID'));
    this.acronym = this.route.snapshot.paramMap.get('acronym');
    this.ruleID = Number(this.route.snapshot.paramMap.get('ruleID'));
  }

  detailClick(record: Record): void {
    record.rules = this.validation.rulesByID;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { record, acronym: this.acronym };
    dialogConfig.autoFocus = false;

    this.dialog.open(EvaluationRulesComponent, dialogConfig);
  }

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        startWith(null),
        tap(() => {
          this.isLoadingResults = true;
          this.validationService
            .getRecordsByHarvestingIDInvalidRuleID(
              this.acronym,
              this.harvestingID,
              this.ruleID,
              this.paginator.pageIndex,
              this.paginator.pageSize
            )
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
            });
        })
      )
      .subscribe(() => {});
  }
}