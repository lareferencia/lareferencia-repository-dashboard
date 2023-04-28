import { AuthenticationService } from './../../../core/services/authentication.service';
import { HarvestingService } from '../../../core/services/harvesting.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HarvestingTableDataSource } from './harvesting-table-datasource';
import { HarvestingContent } from 'src/app/shared/models/harvesting-content.model';

@Component({
  selector: 'app-harvesting-table',
  templateUrl: './harvesting-table.component.html',
  styleUrls: ['./harvesting-table.component.css'],
})
export class HarvestingTableComponent implements OnInit {

  isLoadingResults = true;
  harvestingContent: HarvestingContent[];
  dataSource: HarvestingTableDataSource;
  pageSize = 30;
  csvData: any[];
  headerData: any[];
  admUser = false;


  constructor(
    private harvestingService: HarvestingService,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {

    const acronym = this.route.snapshot.paramMap.get('acronym');

    this.harvestingService.getHarvestingHistoryByAcronym(acronym, 0, this.pageSize)
      .subscribe(({content}) => {
        this.harvestingContent = content.map((harvestingContent) => {
          return {
            ...harvestingContent,
            invalidRecords: harvestingContent.harvestedSize - harvestingContent.validSize,
            
          };
        }).sort(
          (a, b) =>
            new Date(b.startTime).getTime() -
            new Date(a.startTime).getTime()
        );
        console.log(this.harvestingContent);        
      });
  }

  detailClick(harvestingContent: HarvestingContent){
    const acronym = this.route.snapshot.paramMap.get('acronym');
    this.router.navigate([`${acronym}/validation/${harvestingContent.id}`])
  }
}
