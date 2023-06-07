import { Component, OnInit, Input } from '@angular/core';

import { HarvestingService } from 'src/app/core/services/harvesting.service';

import { Record } from 'src/app/shared/models/record.model';
import { DialogData } from 'src/app/validations/interfaces/dialogData.interface';

@Component({
  selector: 'app-evaluation-rules',
  templateUrl: './evaluation-rules.component.html',
  styleUrls: ['./evaluation-rules.component.css'],
})
export class EvaluationRulesComponent implements OnInit {

  @Input() dialogData: DialogData; 
  public record: Record;
  public xml: string;
  public acronym: string;

  constructor(
    private service: HarvestingService,
  ) {}

  ngOnInit(): void {
    this.record = this.dialogData.record;
    this.acronym = this.dialogData.acronym;

    this.service.getMetadataXml(this.acronym, this.record.id).subscribe(result=> {
      this.xml = result;
    })
  }

  getRule(ruleID: string) {
    return this.record.rules.find((x) => x.ruleID === Number(ruleID));
  }

}
