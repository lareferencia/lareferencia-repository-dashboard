import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { startWith, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ElementRef } from '@angular/core';
import { BrokerService } from './../../../core/services/broker.service';
import { Broker } from './../../../shared/models/broker.model';
import { BrokerEventsFilter } from './../../../shared/models/broker-events-filter.model';
import { BrokerEventsTableDataSource } from './broker-events-table-datasource';

@Component({
  selector: 'app-broker-events-table',
  templateUrl: './broker-events-table.component.html',
  styleUrls: ['./broker-events-table.component.css'],
})
export class BrokerEventsTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Broker>;
  @ViewChild('identifier') identifier: ElementRef<HTMLTableHeaderCellElement>;
  @ViewChild('message') message: ElementRef<HTMLTableHeaderCellElement>;
  @ViewChild('topic') topic: ElementRef<HTMLTableHeaderCellElement>;

  dataSource: BrokerEventsTableDataSource;
  pageSize = 10;
  acronym: string;
  isLoadingResults = true;
  csvData: any[];
  headerData: any[];

  filter: BrokerEventsFilter = {
    pageSize: this.pageSize,
    pageNumber: 0,
  };

  displayedColumns = ['identifier', 'message', 'topic'];

  constructor(
    private brokerService: BrokerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.acronym = this.route.snapshot.paramMap.get('acronym');
  }

  clearFilter() {
    this.filter = {};
    this.applyFilter();
  }

  applyFilter() {
    this.paginator.pageIndex = 0;
    this.loadRecords();
  }

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        startWith(null),
        tap(() => {
          this.loadRecords();
        })
      )
      .subscribe(() => {});
  }

  loadRecords() {
    this.filter = {
      ...this.filter,
      pageSize: this.paginator.pageSize,
      pageNumber: this.paginator.pageIndex,
    };
    this.isLoadingResults = true;

    this.brokerService
      .getEventsByAcronym(this.acronym, this.filter)
      .subscribe((result) => {
        this.dataSource = new BrokerEventsTableDataSource(result.content);
        this.paginator.length = result.totalElements;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoadingResults = false;

        this.csvData = result.content.map((x) => {
          return {
            identifier: x.identifier,
            message: x.message,
            topic: x.topic,
          };
        });

        this.headerData = [
          this.identifier.nativeElement.innerText,
          this.message.nativeElement.innerText,
          this.topic.nativeElement.innerText,
        ];
      });
  }
}
