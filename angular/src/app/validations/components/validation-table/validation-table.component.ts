import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Validation } from '../../../shared/models/validation.model';
import { Rule } from '../../../shared/models/rule.model';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';


interface MandatoryOption {
  name: string;
  value: boolean;
}

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
  admUser = false;
  mandatoryOptions: MandatoryOption[];
  isMandatory: MandatoryOption;

  displayedColumns: any[] = [
    {value: 'ruleID', name: 'ID'},
    {value: 'name', name: 'Name'},
    {value: 'description', name: 'Description'},
    {value: 'mandatory', name: 'Mandatory'},
    {value: 'conformity', name: 'Conformity'},
    {value: 'validCount', name: 'Valid records'},
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
    this.mandatoryOptions = [
      {name: 'Mandatory', value: true},
      {name: 'Not mandatory', value: false},
      {name: 'All', value: null}
    ];
  }

  ngAfterViewInit() {
    this.loadRecords()
  }

  loadRecords() {
    this.dataSource = this.validation.rulesByID;

    if (this.isMandatory && this.isMandatory.value !== null)

      this.dataSource = this.validation.rulesByID
        .filter((x) => x.mandatory == this.isMandatory.value);


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
