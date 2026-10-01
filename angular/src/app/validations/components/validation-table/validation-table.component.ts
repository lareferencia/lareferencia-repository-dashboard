import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';


import { Validation } from '../../../shared/models/validation.model';
import { Rule } from '../../../shared/models/rule.model';
import { DialogDataTable } from '../../interfaces/dialogData.interface';
import { MandatoryOption } from '../../interfaces/mandatoryOptions.interface';


@Component({
  selector: 'app-validation-table',
  templateUrl: './validation-table.component.html',
  styleUrls: ['./validation-table.component.css'],
})
export class ValidationTableComponent implements OnInit {
  
  @Input() validation: Validation;

  public dataSource: Rule[];
  public harvestingID: number;
  public acronym: string;
  public csvData: any[];
  public headerData: any[];
  public mandatoryOptions: MandatoryOption[];
  public isMandatory: MandatoryOption;
  public dialogData: DialogDataTable;
  public visible:boolean;


  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.harvestingID = Number(
      this.route.snapshot.paramMap.get('harvestingID')
    );
    this.acronym = this.route.snapshot.paramMap.get('acronym');
    this.mandatoryOptions = [
      {name: 'Mandatory', value: true},
      {name: 'Not mandatory', value: false},
      {name: 'All', value: null}
    ];
    this.loadRecords();
  }

  loadRecords() {
    this.dataSource = this.validation.rulesByID;

    if (this.isMandatory && this.isMandatory.value !== null)

      this.dataSource = this.validation.rulesByID
        .filter((x) => x.mandatory == this.isMandatory.value);


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
    this.headerData = ['ID', 'Name', 'Description', 'Mandatory', 'Conformity', 'Valid records']
  }
  onDialogHide(){
    this.dialogData = null;
  }

  detailClick(rule: Rule): void {
    
    this.visible = true;
    this.dialogData = {
      acronym: this.acronym,
      harvestingID: this.harvestingID,
      ruleID: rule.ruleID,
      name: rule.name,
    }
  }
}
