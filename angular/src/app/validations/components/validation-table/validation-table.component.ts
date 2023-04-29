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
  
  @Input() validation: Validation;


  dataSource: Rule[];
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


  ngAfterViewInit() {
    this.loadRecords()
  }

  loadRecords() {
    let rules = this.validation.rulesByID;
    this.dataSource = rules;
    console.log('dataSource',this.dataSource)

    // if (this.requiredRule != null)
    //   rules = this.validation.rulesByID.filter((x) => x.mandatory == this.requiredRule);

    // this.dataSource = new ValidationTableDataSource(rules);

    // this.csvData = this.validation.rulesByID.map((x) => {
    //   return {
    //     ruleID: x.ruleID,
    //     name: x.name,
    //     description: x.description,
    //     mandatory: x.mandatory,
    //     conformity: x.conformity.toFixed(3),
    //     validCount: x.validCount,
    //   };
    // });
  }

  // detailClick(rule: Rule): void {
  //   const dialogConfig = new MatDialogConfig();

  //   dialogConfig.data = {
  //     acronym: this.acronym,
  //     ruleID: rule.ruleID,
  //     harvestingID: this.harvestingID,
  //     name: rule.name,
  //   };

  //   dialogConfig.autoFocus = false;

  //   this.dialog.open(ValidationDetailComponent, dialogConfig);
  // }
}
