import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ValidationService } from 'src/app/core/services/validation.service';

import { LazyLoadEvent } from 'primeng/api';

import { Record } from 'src/app/shared/models/record.model';
import { Rule } from 'src/app/shared/models/rule.model';
import { Validation } from 'src/app/shared/models/validation.model';
import { RecordsFilter } from 'src/app/shared/models/records-filter.model';
import { DialogData } from 'src/app/validations/interfaces/dialogData.interface';
import { validOptios } from 'src/app/validations/interfaces/validOptions.interface';
import { AppConfigService } from 'src/app/core/services/app-config.service';


@Component({
  selector: 'app-records-table',
  templateUrl: './records-table.component.html',
  styleUrls: ['./records-table.component.css'],
})
export class RecordsTableComponent implements  OnInit {
  

  @Input() validation: Validation;

  public portalUrl: string;

  public dataSource: Record[];
  public pageSize = 10;
  public harvestingID: number;
  public acronym: string;
  public totalRecords:number;
  public isLoading = true;

  public dialogData: DialogData;
  public visible:boolean;
  public dialogTitle: string;

  public rulesOptions: Rule[];
  public selectedValidRule: Rule;
  public selectedInvalidRule: Rule;
  public transformedOptions: any[]
  public selectedTransformedOption: any;

  public validOptions: validOptios[];
  public selectedValidation: boolean;

  public csvData: any[];
  public headerData: any[];

  public filter: RecordsFilter = {
    pageSize: this.pageSize,
    pageNumber: 0,
  };

  constructor(
    private validationService: ValidationService,
    private route: ActivatedRoute,
    private appConfig: AppConfigService
  ) { this.portalUrl = this.appConfig.getValidationModuleData().endpoints.portalService; }

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
    this.transformedOptions = [
      {name: 'No', value: false},
      {name: 'Yes', value: true}
    ]
  }
  detailClick(record: Record): void {
    this.dialogTitle = record.identifier;
    record.rules = this.validation.rulesByID;
    this.visible = true;    
    this.dialogData = { record, acronym: this.acronym };
  };

  getPublicationUrl(id: string) {
    const splits = id.split('-');
    if (this.portalUrl && splits.length > 1) {
      return`${this.portalUrl}${splits[1]}`;
    }
  }

  onDialogHide(){
    this.dialogData = null;
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

        this.csvData = result.content.map((x) => {
          return {
            id: x.id,
            identifier: x.identifier,
            validation: x.isValid,
            tranformation: x.isTransformed,
          };
        });
      });

      this.headerData = ['ID', 'Identifier', 'Validation']
  }
}