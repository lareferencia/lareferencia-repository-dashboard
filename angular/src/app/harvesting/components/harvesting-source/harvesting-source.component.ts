import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HarvestingService } from '../../../core/services/harvesting.service';

import { Harvesting } from '../../../shared/models/harvesting.model';
import { HarvestingHistory } from 'src/app/shared/models/harvesting-history.model';

@Component({
  selector: 'app-harvesting-source',
  templateUrl: './harvesting-source.component.html',
})


export class HarvestingSourceComponent implements OnInit {
  harvesting: Harvesting;
  harvestingHistory: HarvestingHistory;
  pageNumber = 0;
  pageSize = 2;

  constructor(
    private route: ActivatedRoute,
    private harvestingService: HarvestingService
  ) {}

  ngOnInit(): void {
    const acronym = this.route.snapshot.paramMap.get('acronym');

    this.harvestingService
      .getHarvestingHistoryByAcronym(acronym, this.pageNumber, this.pageSize)
      .subscribe((harvestingHistory) => {
        this.harvestingHistory = harvestingHistory;
      });
  }
}
