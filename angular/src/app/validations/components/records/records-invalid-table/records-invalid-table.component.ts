import { ActivatedRoute } from '@angular/router';
import { ValidationService } from 'src/app/core/services/validation.service';
import { Component, OnInit, Input } from '@angular/core';
import { Validation } from 'src/app/shared/models/validation.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LazyLoadEvent } from 'primeng/api';
import { Record } from 'src/app/shared/models/record.model';
import { dialogData } from 'src/app/validations/interfaces/dialogData.interface';

@Component({
  selector: 'app-records-invalid-table',
  templateUrl: './records-invalid-table.component.html',
  styleUrls: ['./records-invalid-table.component.css'],
})
export class RecordsInvalidTableComponent implements OnInit {
  
  @Input() validation: Validation;
  dataSource: any;
  pageSize = 10;
  pageNumber = 0;
  totalRecords: number;
  harvestingID: number;
  acronym: string;
  ruleID: number;
  isLoadingResults = true;
  csvData: any[];

  dialogData: dialogData;
  visible:boolean;
  dialogTitle: string;
  
 

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

  loadRecords(event: LazyLoadEvent) {
    this.isLoadingResults = true;

    this.pageSize = event.rows;
    this.pageNumber = event.first / event.rows;

    this.validationService.getRecordsByHarvestingIDInvalidRuleID(
      this.acronym,
      this.harvestingID,
      this.ruleID,
      this.pageNumber,
      this.pageSize
    ).subscribe((result) => {
      this.dataSource = result.content;
      this.totalRecords = result.totalElements;

    });
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
