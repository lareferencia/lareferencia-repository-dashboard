import { Validation } from 'src/app/shared/validation.model';
import { ValidationService } from 'src/app/services/validation.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Rule } from 'src/app/shared/rule.model';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.css'],
})
export class ValidationComponent implements OnInit {
  firstAccess = false;
  error = false;
  isLoadingResults = true;
  harvestingID: number;
  validation: Validation;

  constructor(
    private route: ActivatedRoute,
    private validationService: ValidationService
  ) {}
  
  ngOnInit(): void {
    this.harvestingID = Number(
      this.route.snapshot.paramMap.get('harvestingID')
    );

    if (this.harvestingID != 0) {
      this.validationService
        .getValidationResultsByHarvestingID(this.harvestingID)
        .subscribe((result) => {
          this.validation = result;

          let rules: Rule[] = Object.values(this.validation.rulesByID).map(
            (rule) => {
              const { validCount, invalidCount } = rule;
              const total: number = invalidCount + validCount;
              return {
                ...rule,
                conformity: total > 0 ? (validCount * 100) / total : 0,
              };
            }
          );

          this.validation.rulesByID = rules;
        },
        () => {
          this.error = true;
          this.isLoadingResults = false;
        },
        ()=> {
          this.isLoadingResults = false;
        });
    } else {
      this.firstAccess = true;
      this.isLoadingResults = false;
    }
  }
}
