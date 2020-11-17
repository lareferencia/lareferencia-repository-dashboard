import { Harvesting } from '../../../shared/harvesting.model';
import { HarvestingService } from '../../../core/services/harvesting.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HarvestingHistory } from 'src/app/shared/harvesting-history.model';

@Component({
  selector: 'app-harvesting-source',
  templateUrl: './harvesting-source.component.html',
  styleUrls: ['./harvesting-source.component.css'],
})
export class HarvestingSourceComponent implements OnInit {
  harvesting: Harvesting;
  harvestingHistory: HarvestingHistory;
  pageNumber = 0;
  pageSize = 12;

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
