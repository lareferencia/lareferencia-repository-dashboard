import { Component, OnInit, Input } from '@angular/core';
import { Validation } from 'src/app/shared/models/validation.model';
import { Record } from 'src/app/shared/models/record.model';
import { ValidationService } from 'src/app/core/services/validation.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EvaluationRulesComponent } from '../../rule/evaluation-rules/evaluation-rules.component';
import { RecordsFilter } from 'src/app/shared/models/records-filter.model';
import { LazyLoadEvent } from 'primeng/api';
import { Rule } from 'src/app/shared/models/rule.model';

interface validOptios {
  name: string;
  value: boolean;
};

@Component({
  selector: 'app-records-table',
  templateUrl: './records-table.component.html',
  styleUrls: ['./records-table.component.css'],
})
export class RecordsTableComponent implements  OnInit {
  

  @Input() validation: Validation;

  dataSource: Record[];
  pageSize = 10;
  harvestingID: number;
  acronym: string;
  totalRecords:number;
  isLoading = true;
  
  rulesOptions: Rule[];
  selectedValidRule: Rule;
  selectedInvalidRule: Rule;

  validOptions: validOptios[];
  selectedValidation: boolean;


  csvData: any[];
  headerData: any[];

  filter: RecordsFilter = {
    pageSize: this.pageSize,
    pageNumber: 0,
  };

  constructor(
    private validationService: ValidationService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.harvestingID = Number(this.route.snapshot.paramMap.get('harvestingID'));
    this.acronym = this.route.snapshot.paramMap.get('acronym');

    this.rulesOptions = this.validation.rulesByID
      .map( rule =>{
      return rule
    });

    this.validOptions = [
      {name: 'Invalid', value: false},
      {name: 'Valid', value: true},
      {name: 'All', value: null},
    ];
  }

 

  detailClick(record: Record): void {
    record.rules = this.validation.rulesByID;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { record, acronym: this.acronym };
    dialogConfig.autoFocus = false;

    this.dialog.open(EvaluationRulesComponent, dialogConfig);
  }

  clearFilters() {
    this.filter = {};
    this.applyFilter();
  }

  applyFilter() {
    this.loadRecords({ first: 0, rows: this.pageSize });
  }


  loadRecords(event: LazyLoadEvent) {
    this.isLoading = true;

    this.filter = {
      ...this.filter,
      pageSize: event.rows,
      pageNumber: event.first / event.rows,
    };

    this.validationService.getRecordsByHarvestingIDFilter(this.acronym, this.harvestingID, this.filter)
      .subscribe((result) => {


        this.isLoading = false;

        this.dataSource = result.content
        this.totalRecords = result.totalElements;

        // this.csvData = result.content.map((x) => {
        //   return {
        //     id: x.id,
        //     identifier: x.identifier,
        //     validation: x.isValid,
        //     ...(this.admUser && {tranformation: x.isTransformed}),
        //   };
        // });

        // this.headerData = [
        //   this.id.nativeElement.innerText,
        //   this.identifier.nativeElement.innerText,
        //   this.isValid.nativeElement.innerText,
        //   ...(this.admUser ? [this.isTransformed.nativeElement.innerText] : ''),
        // ];
      });
  }
}