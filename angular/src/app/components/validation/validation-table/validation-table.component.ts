import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ValidationDetailComponent } from './../validation-detail/validation-detail.component';
import { Validation } from '../../../shared/models/validation.model';
import { Rule } from '../../../shared/models/rule.model';
import { Component, OnInit, ViewChild, Input, ElementRef, AfterViewInit } from '@angular/core';
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
export class ValidationTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Rule>;
  @Input() validation: Validation;
  @ViewChild('ruleID') ruleID: any;
  @ViewChild('name') name: ElementRef<HTMLTableHeaderCellElement>;
  @ViewChild('description') description: ElementRef<HTMLTableHeaderCellElement>;
  @ViewChild('mandatory') mandatory: any;
  @ViewChild('conformity') conformity: any;
  @ViewChild('validCount') validCount: any;

  dataSource: ValidationTableDataSource;
  harvestingID: number;
  acronym: string;
  csvData: any[];
  headerData: any[];
  requiredRule? = true;
  admUser = false;

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

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.admUser = this.authenticationService.isAdmUser();
    this.harvestingID = Number(
      this.route.snapshot.paramMap.get('harvestingID')
    );
    this.acronym = this.route.snapshot.paramMap.get('acronym');
  }

  applyFilter() {
    this.paginator.pageIndex = 0;
    this.loadRecords();
  }

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        startWith(null),
        delay(0),
        tap(() => {
          this.loadRecords();
        })
      )
      .subscribe(() => {});
  }

  loadRecords() {
    let rules = this.validation.rulesByID;

    if (this.requiredRule != null)
      rules = this.validation.rulesByID.filter((x) => x.mandatory == this.requiredRule);

    this.dataSource = new ValidationTableDataSource(rules);
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

    this.headerData = [
      this.ruleID._elementRef.nativeElement.innerText,
      this.name.nativeElement.innerText,
      this.description.nativeElement.innerText,
      this.mandatory._elementRef.nativeElement.innerText,
      this.conformity._elementRef.nativeElement.innerText,
      this.validCount._elementRef.nativeElement.innerText,
    ];
  }

  detailClick(rule: Rule): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      acronym: this.acronym,
      ruleID: rule.ruleID,
      harvestingID: this.harvestingID,
      name: rule.name,
    };

    dialogConfig.autoFocus = false;

    this.dialog.open(ValidationDetailComponent, dialogConfig);
  }
}
