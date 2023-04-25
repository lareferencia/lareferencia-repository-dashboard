import { Harvesting } from '../../../shared/models/harvesting.model';
import { HarvestingContent } from '../../../shared/models/harvesting-content.model';
import { NavService } from '../../../core/services/nav.service';
import { HarvestingService } from '../../../core/services/harvesting.service';
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
  acronym: string;
  error = false;
  isLoadingResults = true;
  
  constructor(
    private route: ActivatedRoute,
    private harvestingService: HarvestingService,
    private navService: NavService,
  ) {}

  ngOnInit(): void {

    this.route.params.subscribe(() => {
      this.error = false;
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
        console.log(harvesting);
        this.harvesting = harvesting;
      })
    });
  }
}
