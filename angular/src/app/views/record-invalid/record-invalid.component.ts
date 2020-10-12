import { Component, OnInit } from '@angular/core';
import { ValidationService } from 'src/app/services/validation.service';
import { ActivatedRoute } from '@angular/router';
import { Validation } from 'src/app/shared/validation.model';

@Component({
  selector: 'app-record-invalid',
  templateUrl: './record-invalid.component.html',
  styleUrls: ['./record-invalid.component.css'],
})
export class RecordInvalidComponent implements OnInit {
  validation: Validation;
  ruleID: string;

  constructor(
    private validationService: ValidationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const harvestingID = Number(
      this.route.snapshot.paramMap.get('harvestingID')
    );

    this.ruleID = this.route.snapshot.paramMap.get('ruleID');

    this.validationService
      .getValidationResultsByHarvestingID(harvestingID)
      .subscribe((result) => {
        this.validation = result;
        this.validation.rulesByID = Object.values(this.validation.rulesByID);
      });
  }
}
