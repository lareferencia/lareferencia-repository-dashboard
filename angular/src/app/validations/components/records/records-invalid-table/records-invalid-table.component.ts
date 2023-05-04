import { ActivatedRoute } from '@angular/router';
import { ValidationService } from 'src/app/core/services/validation.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Validation } from 'src/app/shared/models/validation.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LazyLoadEvent } from 'primeng/api';

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

      this.isLoadingResults = false;
    });
  }


  // detailClick(record: Record): void {
  //   record.rules = this.validation.rulesByID;

  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.data = { record, acronym: this.acronym };
  //   dialogConfig.autoFocus = false;

  //   this.dialog.open(EvaluationRulesComponent, dialogConfig);
  // }
    

}
