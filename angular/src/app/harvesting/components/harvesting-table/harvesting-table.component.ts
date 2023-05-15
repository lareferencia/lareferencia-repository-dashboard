import { AuthenticationService } from './../../../core/services/authentication.service';
import { HarvestingService } from '../../../core/services/harvesting.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HarvestingTableDataSource } from './harvesting-table-datasource';
import { HarvestingContent } from 'src/app/shared/models/harvesting-content.model';
import { LazyLoadEvent, SortEvent } from 'primeng/api';

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
  pageSize: number = 80;
  pageNumber: number;
  totalRecords: number;
  isLoading: boolean = true;

  filter = {
    sortField: '',
    sortOrder: 1,
  };

  displayColumns = [
    {
      title: 'ID',
      field: 'id',
    },
    {
      title: 'Harvested Record',
      field: 'harvestedSize',
    },
    {
      title: 'Valid Records',
      field: 'validSize',
    },
    {
      title: 'Invalid Records',
      field: 'invalidRecords',
    },
    {
      title: 'Start',
      field: 'startTime',
    },
    {
      title: 'End',
      field: 'endTime',
    },
  ]

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

  onSort(event: SortEvent) {
    this.filter.sortField = event.field;
    this.filter.sortOrder = event.order === 1 ? 1 : -1;
    this.loadContent({
      first: 0,
      rows: this.pageSize,
      sortField: this.filter.sortField,
      sortOrder: this.filter.sortOrder
    });
  }

  loadContent(event: LazyLoadEvent){
    
    this.isLoading = true;

    this.pageNumber = event.first / event.rows;
    this.pageSize = event.rows;

    
    this.harvestingService.getHarvestingHistoryByAcronym(
      this.acronym, 
      this.pageNumber, 
      this.pageSize,
      this.filter.sortField,
      this.filter.sortOrder)
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
