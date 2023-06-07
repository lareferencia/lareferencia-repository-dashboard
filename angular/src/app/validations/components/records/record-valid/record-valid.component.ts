// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';

// import { ValidationService } from 'src/app/core/services/validation.service';

// import { Validation } from 'src/app/shared/models/validation.model';

// @Component({
//   selector: 'app-record-valid',
//   templateUrl: './record-valid.component.html',
//   styleUrls: ['./record-valid.component.css'],
// })
// export class RecordValidComponent implements OnInit {
//   public validation: Validation;
//   public ruleID: string;

//   constructor(
//     private validationService: ValidationService,
//     private route: ActivatedRoute
//   ) {}

//   ngOnInit(): void {
//     const harvestingID = Number(
//       this.route.snapshot.paramMap.get('harvestingID')
//     );
//     const acronym = this.route.snapshot.paramMap.get('acronym');
//     this.ruleID = this.route.snapshot.paramMap.get('ruleID');
//     this.validationService
//       .getValidationResultsByHarvestingID(acronym, harvestingID)
//       .subscribe((result) => {
//         this.validation = result;
//         this.validation.rulesByID = Object.values(this.validation.rulesByID);
//       });
//   }
  
//   getRule(ruleID: string) {
//     return this.validation.rulesByID.find((x) => x.ruleID === Number(ruleID));
//   }
// }
