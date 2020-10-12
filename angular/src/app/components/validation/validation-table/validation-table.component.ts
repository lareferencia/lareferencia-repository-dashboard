import { ValidationDetailComponent } from './../validation-detail/validation-detail.component';
import { Validation } from '../../../shared/validation.model';
import { Rule } from '../../../shared/rule.model';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ValidationTableDataSource } from './validation-table-datasource';
import { MatPaginator } from '@angular/material/paginator';
import { startWith, tap, delay } from 'rxjs/operators';

@Component({
  selector: 'app-validation-table',
  templateUrl: './validation-table.component.html',
  styleUrls: ['./validation-table.component.css'],
})
export class ValidationTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Rule>;
  @Input() validation: Validation;
  dataSource: ValidationTableDataSource;
  harvestingID: number;
  csvData: any[];

  displayedColumns: string[] = [
    'ruleID',
    'name',
    'description',
    'mandatory',
    'conformity',
    'validCount',
    'button-records',
    'button-detail',
  ];

  constructor(private route: ActivatedRoute, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.harvestingID = Number(
      this.route.snapshot.paramMap.get('harvestingID')
    );
  }

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        startWith(null),
        delay(0),
        tap(() => {
          this.dataSource = new ValidationTableDataSource(
            this.validation.rulesByID
          );
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;

          this.csvData = this.validation.rulesByID.map((x) => {
            return {
              ruleID: x.ruleID,
              name: x.name,
              description: x.description,
              mandatory: x.mandatory,
              conformity: x.conformity.toFixed(3),
              validCount: x.validCount,
            };
          });
        })
      )
      .subscribe();
  }

  detailClick(rule: Rule): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      ruleID: rule.ruleID,
      harvestingID: this.harvestingID,
      name: rule.name,
    };

    dialogConfig.autoFocus = false;

    this.dialog.open(ValidationDetailComponent, dialogConfig);
  }
}
