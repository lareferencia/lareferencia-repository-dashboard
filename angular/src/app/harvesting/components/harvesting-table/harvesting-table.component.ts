import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from './../../../core/services/authentication.service';
import { HarvestingService } from '../../../core/services/harvesting.service';

import { HarvestingContent } from 'src/app/shared/models/harvesting-content.model';
import { LazyLoadEvent, SortEvent } from 'primeng/api';

@Component({
  selector: 'app-harvesting-table',
  templateUrl: './harvesting-table.component.html',
  styleUrls: ['./harvesting-table.component.css'],
})
export class HarvestingTableComponent implements OnInit {

  public acronym: string;
  public isLoadingResults = true;
  public harvestingContent: HarvestingContent[];
  public pageSize: number = 10;
  public pageNumber: number;
  public totalRecords: number;
  public isLoading: boolean = true;

  public csvData: any[];
  public headerData: any[];
  admUser = false;


  public filter = {
    sortField: '',
    sortOrder: 1,
  };

  public displayColumns = [
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
  ];

  constructor(
    private harvestingService: HarvestingService,
    private route: ActivatedRoute,
    private router: Router,
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
        })
        this.csvData = result.content.map( (item) => {
          return{
            id: item.id,
            harvestedSize: item.harvestedSize,
            validSize: item.validSize,
            invalidRecords: item.harvestedSize - item.validSize,
            transformedSize: item.transformedSize,
            startTime: item.startTime,
            endTime: item.endTime,
          }
        });
      });
      this.headerData = [
        'id',
        'harvestedSize',
        'validSize',
        'invalidRecords',
        'transformedSize',
        'startTime',
        'endTime',
      ]

  }

  detailClick(harvestingContent: HarvestingContent){
    const acronym = this.route.snapshot.paramMap.get('acronym');
    this.router.navigate([`${acronym}/validation/${harvestingContent.id}`])
  }
}
