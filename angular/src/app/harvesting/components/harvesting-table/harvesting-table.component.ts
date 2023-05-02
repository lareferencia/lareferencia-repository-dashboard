import { AuthenticationService } from './../../../core/services/authentication.service';
import { HarvestingService } from '../../../core/services/harvesting.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HarvestingTableDataSource } from './harvesting-table-datasource';
import { HarvestingContent } from 'src/app/shared/models/harvesting-content.model';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-harvesting-table',
  templateUrl: './harvesting-table.component.html',
  styleUrls: ['./harvesting-table.component.css'],
})
export class HarvestingTableComponent implements OnInit {

  acronym: string;
  isLoadingResults = true;
  harvestingContent: HarvestingContent[];
  dataSource: HarvestingTableDataSource;
  pageSize: number = 10;
  pageNumber: number;
  totalRecords: number;
  isLoading: boolean = true;


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
    this.acronym = this.route.snapshot.paramMap.get('acronym');
  }

  loadContent(event: LazyLoadEvent){
    this.isLoading = true;

    this.pageNumber = event.first / event.rows;
    this.pageSize = event.rows;

    
    this.harvestingService.getHarvestingHistoryByAcronym(this.acronym, this.pageNumber, this.pageSize)
      .subscribe((result) => {

        this.isLoading = false;
        this.totalRecords = result.totalElements;
        this.harvestingContent = result.content.map((harvestingContent) => {
          return {
            ...harvestingContent,
            invalidRecords: harvestingContent.harvestedSize - harvestingContent.validSize,    
          };
        }).sort(
          (a, b) =>
            new Date(b.startTime).getTime() -
            new Date(a.startTime).getTime()
        );
      });

  }

  detailClick(harvestingContent: HarvestingContent){
    const acronym = this.route.snapshot.paramMap.get('acronym');
    this.router.navigate([`${acronym}/validation/${harvestingContent.id}`])
  }
}
