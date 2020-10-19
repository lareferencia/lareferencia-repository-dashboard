import { MatPaginator } from '@angular/material/paginator';
import { HarvestingService } from './../../../services/harvesting.service';
import { HarvestingContent } from './../../../shared/harvesting-content.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
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
  isLoadingResults = true;
  harvestingContent: HarvestingContent;
  dataSource: HarvestingTableDataSource;
  pageSize = 10;
  acronym: string;
  csvData: any[];

  displayedColumns = [
    'id',
    'harvestedSize',
    'validSize',
    'invalidRecords',
    'transformedSize',
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
