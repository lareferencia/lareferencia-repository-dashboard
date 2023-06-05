import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ValidationService } from 'src/app/core/services/validation.service';

import { LazyLoadEvent } from 'primeng/api';

import { Validation } from 'src/app/shared/models/validation.model';
import { Record } from 'src/app/shared/models/record.model';
import { DialogData } from 'src/app/validations/interfaces/dialogData.interface';
import { RecordsFilter } from 'src/app/shared/models/records-filter.model';

@Component({
  selector: 'app-records-invalid-table',
  templateUrl: './records-invalid-table.component.html',
  styleUrls: ['./records-invalid-table.component.css'],
})
export class RecordsInvalidTableComponent implements OnInit {
  
  @Input() validation: Validation;
  
  public dataSource: any;
  public pageSize = 10;
  public pageNumber = 0;
  public totalRecords: number;
  public harvestingID: number;
  public acronym: string;
  public ruleID: number;
  public isLoadingResults = true;
  public csvData: any[];
  public headerData: any[];

  public dialogData: DialogData;
  public visible:boolean;
  public dialogTitle: string;

  public filter: RecordsFilter = {
    oaiIdentifier: ''
  };
  
  constructor(
    private validationService: ValidationService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.harvestingID = Number(this.route.snapshot.paramMap.get('harvestingID'));
    this.acronym = this.route.snapshot.paramMap.get('acronym');
    this.ruleID = Number(this.route.snapshot.paramMap.get('ruleID'));
    this.isLoadingResults = false;
  }

  applyFilter() {
    this.loadRecords({ first: 0, rows: this.pageSize });
  }
  clearFilters() {
    this.filter = {
      oaiIdentifier: ''
    }
    this.loadRecords({ first: 0, rows: this.pageSize});
  }

  loadRecords(event: LazyLoadEvent) {

    this.isLoadingResults = true;
    this.pageSize = event.rows;
    this.pageNumber = event.first / event.rows;

    this.validationService.getRecordsByHarvestingIDInvalidRuleID(
      this.acronym,
      this.harvestingID,
      this.ruleID,
      this.pageNumber,
      this.pageSize,
      this.filter
    ).subscribe((result) => {
      this.dataSource = result.content;
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
    this.headerData = ['ID', 'Identifier', 'Validation', 'Transformed']
    this.isLoadingResults = false;
  }

  detailClick(record: Record): void {
    
    this.dialogTitle = record.identifier;
    record.rules = this.validation.rulesByID;
    this.visible = true;
    this.dialogData = { record, acronym: this.acronym };
  };

  onDialogHide(){
    this.dialogData = null;
  }
}
