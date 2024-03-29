import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ValidationService } from 'src/app/core/services/validation.service';
import { HarvestingService } from 'src/app/core/services/harvesting.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

import { Harvesting } from 'src/app/shared/models/harvesting.model';
import { Validation } from 'src/app/shared/models/validation.model';
import { Rule } from 'src/app/shared/models/rule.model';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
})
export class ValidationComponent implements OnInit {
  public firstAccess = false;
  public error = false;
  public isLoadingResults = true;
  public validation: Validation;
  public harvesting: Harvesting;
  public admUser = false;

  constructor(
    private route: ActivatedRoute,
    private validationService: ValidationService,
    private harvestingService: HarvestingService,
    private authenticationService: AuthenticationService
  ) {}
  
  ngOnInit(): void {
    this.admUser = this.authenticationService.isAdmUser();
    
    this.route.params.subscribe(() => {
      
      this.validation = null;
      this.isLoadingResults = true;
      const harvestingID = Number(this.route.snapshot.paramMap.get('harvestingID'));
      const acronym = this.route.snapshot.paramMap.get('acronym');

      if (harvestingID != 0) {
        this.validationService
          .getValidationResultsByHarvestingID(acronym, harvestingID)
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
            this.error = false;
            this.isLoadingResults = false;
          });

          this.harvestingService.getHarvestingByAcronym(acronym).subscribe(harvesting => {
            this.harvesting = harvesting;
          })

      } else {
        this.firstAccess = true;
        this.isLoadingResults = false;
      }
   });
  }
}
