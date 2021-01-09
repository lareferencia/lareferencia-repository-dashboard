import { MatPaginator } from '@angular/material/paginator';
import { HarvestingService } from '../../../core/services/harvesting.service';
import { HarvestingContent } from '../../../shared/models/harvesting-content.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { HarvestingTableDataSource } from './harvesting-table-datasource';
import { startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'app-harvesting-table',
  templateUrl: './harvesting-table.component.html',
  styleUrls: ['./harvesting-table.component.css'],
})
export class HarvestingTableComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('id') id : any;
  @ViewChild('harvestedSize') harvestedSize : any;
  @ViewChild('validSize') validSize : any;
  @ViewChild('invalidRecords') invalidRecords : any;
  @ViewChild('startTime') startTime : any;
  @ViewChild('endTime') endTime : any;
  isLoadingResults = true;
  harvestingContent: HarvestingContent;
  dataSource: HarvestingTableDataSource;
  pageSize = 10;
  acronym: string;
  csvData: any[];
  headerData: any[];

  displayedColumns = [
    'id',
    'validSize',
    'invalidRecords',
    'harvestedSize',
    'startTime',
    'endTime',
    'button',
  ];

  constructor(
    private harvestingService: HarvestingService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.acronym = this.route.snapshot.paramMap.get('acronym');
  }

  detailClick(harvestingContent: HarvestingContent): void {
    this.router.navigate([`${this.acronym}/validation/${harvestingContent.id}`]);
  }

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        startWith(null),
        tap(() => {
          this.isLoadingResults = true;

          this.harvestingService
            .getHarvestingHistoryByAcronym(
              this.acronym,
              this.paginator.pageIndex,
              this.paginator.pageSize
            )
            .subscribe((harvestingHistory) => {
              harvestingHistory.content = harvestingHistory.content
                .map((x) => {
                  return {
                    ...x,
                    invalidRecords: x.harvestedSize - x.validSize,
                  };
                })
                .sort(
                  (a, b) =>
                    new Date(b.startTime).getTime() -
                    new Date(a.startTime).getTime()
                );
              
              this.csvData = harvestingHistory.content.map((x) => {
                return {
                  id: x.id,
                  harvestedSize: x.harvestedSize,
                  validSize: x.validSize,
                  invalidRecords: x.invalidRecords,
                  startTime: x.startTime,
                  endTime: x.endTime,
                };
              });

              this.headerData = [
                this.id._elementRef.nativeElement.innerText,
                this.harvestedSize._elementRef.nativeElement.innerText,
                this.validSize._elementRef.nativeElement.innerText,
                this.invalidRecords._elementRef.nativeElement.innerText,
                this.startTime._elementRef.nativeElement.innerText,
                this.endTime._elementRef.nativeElement.innerText,
              ];

              this.dataSource = new HarvestingTableDataSource(
                harvestingHistory.content
              );
              this.paginator.length = harvestingHistory.totalElements;
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              this.isLoadingResults = false;
            });
        })
      )
      .subscribe(() => {});
  }
}
