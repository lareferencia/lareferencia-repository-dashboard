import { HarvestingService } from '../../../core/services/harvesting.service';
import { Harvesting } from '../../../shared/models/harvesting.model';
import { Component, OnInit } from '@angular/core';
import { ValidationService } from 'src/app/core/services/validation.service';
import { ActivatedRoute } from '@angular/router';
import { Validation } from 'src/app/shared/models/validation.model';

@Component({
  selector: 'app-record-invalid',
  templateUrl: './record-invalid.component.html',
  styleUrls: ['./record-invalid.component.css'],
})
export class RecordInvalidComponent implements OnInit {
  validation: Validation;
  ruleID: string;
  harvesting: Harvesting;

  constructor(
    private validationService: ValidationService,
    private route: ActivatedRoute,
    private harvestingService: HarvestingService,
  ) {}

  ngOnInit(): void {
    const harvestingID = Number(this.route.snapshot.paramMap.get('harvestingID'));
    const acronym = this.route.snapshot.paramMap.get('acronym');

    this.ruleID = this.route.snapshot.paramMap.get('ruleID');

    this.validationService
      .getValidationResultsByHarvestingID(acronym, harvestingID)
      .subscribe((result) => {
        this.validation = result;
        this.validation.rulesByID = Object.values(this.validation.rulesByID);
      });

      this.harvestingService.getHarvestingByAcronym(acronym).subscribe(harvesting => {
        this.harvesting = harvesting;
      })
  }

  getRule(ruleID: string) {
    return this.validation.rulesByID.find((x) => x.ruleID === Number(ruleID));
  }
}
