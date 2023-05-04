import { Component, OnInit } from '@angular/core';
import { ValidationService } from 'src/app/core/services/validation.service';
import { ActivatedRoute } from '@angular/router';
import { Validation } from 'src/app/shared/models/validation.model';
import { HarvestingService } from 'src/app/core/services/harvesting.service';
import { Harvesting } from 'src/app/shared/models/harvesting.model';

@Component({
  selector: 'app-record-invalid',
  templateUrl: './record-invalid.component.html',
  styleUrls: ['./record-invalid.component.css'],
})
export class RecordInvalidComponent implements OnInit {
  validation: Validation;
  ruleID: string;
  harvesting: Harvesting;
  ruleName: string;
  isLoadingResults = true;

  constructor(
    private validationService: ValidationService,
    private route: ActivatedRoute,
    private harvestingService: HarvestingService,
  ) {}

  ngOnInit(): void {
    this.isLoadingResults = true;

    const harvestingID = Number(this.route.snapshot.paramMap.get('harvestingID'));
    const acronym = this.route.snapshot.paramMap.get('acronym');

    this.ruleID = this.route.snapshot.paramMap.get('ruleID');

    this.validationService
      .getValidationResultsByHarvestingID(acronym, harvestingID)
      .subscribe((result) => {
        this.isLoadingResults = false;

        this.validation = result;
        this.validation.rulesByID = Object.values(this.validation.rulesByID);
        this.ruleName = this.validation.rulesByID.find((x) => x.ruleID === Number(this.ruleID)).name;
      });

      this.harvestingService.getHarvestingByAcronym(acronym).subscribe(harvesting => {
        this.harvesting = harvesting; 
      })


  }

  // getRule(ruleID: string) {
  //   const rule = this.validation.rulesByID.find((x) => x.ruleID === Number(ruleID));
  //   if(!rule) return;
  //   return rule.name
  // }
}
