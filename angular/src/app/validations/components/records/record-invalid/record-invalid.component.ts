import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ValidationService } from 'src/app/core/services/validation.service';
import { HarvestingService } from 'src/app/core/services/harvesting.service';

import { Validation } from 'src/app/shared/models/validation.model';
import { Harvesting } from 'src/app/shared/models/harvesting.model';

@Component({
  selector: 'app-record-invalid',
  templateUrl: './record-invalid.component.html',
})

export class RecordInvalidComponent implements OnInit {
  public validation: Validation;
  public ruleID: string;
  public harvesting: Harvesting;
  public ruleName: string;
  public isLoadingResults = true;

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
}
