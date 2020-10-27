import { Harvesting } from './../../shared/harvesting.model';
import { HarvestingContent } from './../../shared/harvesting-content.model';
import { NavService } from './../../services/nav.service';
import { HarvestingService } from './../../services/harvesting.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-harvesting',
  templateUrl: './harvesting.component.html',
  styleUrls: ['./harvesting.component.css']
})
export class HarvestingComponent implements OnInit {
  harvesting: Harvesting;
  harvestingContent: HarvestingContent;
  error = false;
  isLoadingResults = true;
  
  constructor(
    private route: ActivatedRoute,
    private harvestingService: HarvestingService,
    private navService: NavService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.harvestingContent = null;
      this.isLoadingResults = true;
      const acronym = this.route.snapshot.paramMap.get('acronym');

      this.harvestingService
        .getHarvestingLastGoodKnowByAcronym(acronym)
        .subscribe(
          (harvestingContent) => {
            this.harvestingContent = harvestingContent;
            this.navService.navData = {
              harvestingID: Number(harvestingContent.id),
              acronym: acronym,
            };
            this.isLoadingResults = false;
          },
          () => {
            this.error = true;
          }
        );

      this.harvestingService.getHarvestingByAcronym(acronym).subscribe(harvesting => {
        this.harvesting = harvesting;
      })
    });
  }
}
