import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { startWith, delay, tap } from 'rxjs/operators';
import { HarvestingService } from 'src/app/core/services/harvesting.service';
import { AcronymFilter } from 'src/app/shared/models/acronym-filter.model';
import { Harvesting } from 'src/app/shared/models/harvesting.model';
import { AcronymTableDataSource } from './acronym-table-datasource';

@Component({
  selector: 'app-acronym-table',
  templateUrl: './acronym-table.component.html',
  styleUrls: ['./acronym-table.component.css'],
})
export class AcronymTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Harvesting>;
  @ViewChild('id') id : any;
  @ViewChild('institutionAcronym') institutionAcronym : any;
  @ViewChild('institutionName') institutionName : any;
  @ViewChild('acronym') acronym : any;
  @ViewChild('name') name : any;
  dataSource: AcronymTableDataSource;
  csvData: any[];
  headerData: any[];
  harvestings: Harvesting[];
  filter = {} as AcronymFilter;

  constructor(
    private harvestingService: HarvestingService,
    private router: Router
  ) {}

  displayedColumns = [
    'id',
    'institutionAcronym',
    'institutionName',
    'acronym',
    'name',
    'teste',
    'button-history',
    'button-validation',
  ];

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        startWith(null),
        delay(0),
        tap(() => {
          this.loadRecords();
        })
      )
      .subscribe(() => {});
  }

  loadRecords() {
    this.harvestingService.getHarvestingList().subscribe((harvestingList) => {
      this.harvestings = harvestingList.content.sort(
        (a, b) => +(a.acronym > b.acronym) || -(a.acronym < b.acronym)
      );

      this.harvestings.forEach((harvesting) => {
        this.harvestingService
          .getHarvestingLastGoodKnowByAcronym(harvesting.acronym)
          .subscribe(
            (lkg) => {
              console.log(lkg);
              harvesting.lkgValidSize = lkg.validSize;
              harvesting.lkgTransformedSize = lkg.transformedSize;
              harvesting.lkgHarvestedSize = lkg.harvestedSize;
            },
            () => {
              harvesting.lkgValidSize = 0;
              harvesting.lkgTransformedSize = 0;
              harvesting.lkgHarvestedSize = 0;
            }
          );
      });
      this.loadData(this.harvestings);
    });
  }

  historyClick(harvesting: Harvesting): void {
    this.router.navigate([`/${harvesting.acronym}`]);
  }

  validationClick(harvesting: Harvesting) {
    this.harvestingService
      .getHarvestingLastGoodKnowByAcronym(harvesting.acronym)
      .subscribe(
        (harvestingContent) => {
          this.router.navigate([
            `${harvesting.acronym}/validation/${harvestingContent.id}`,
          ]);
        },
        () => {
          this.router.navigate([`${harvesting.acronym}/validation/-1`]);
        }
      );
  }

  private loadData(harvestings: Harvesting[]) {
    this.dataSource = new AcronymTableDataSource(harvestings);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.paginator.length = harvestings.length;

    this.csvData = harvestings.map((x) => {
      return {
        id: x.id,
        institutionAcronym: x.institutionAcronym,
        institutionName: x.institutionName,
        acronym: x.acronym,
        name: x.name,
        telephone: x.attributes.telephone, 
        contactEmail: x.attributes.contact_email, 
      };
    });

    this.headerData = [
      this.id._elementRef.nativeElement.innerText,
      this.institutionAcronym._elementRef.nativeElement.innerText,
      this.institutionName._elementRef.nativeElement.innerText,
      this.acronym._elementRef.nativeElement.innerText,
      this.name._elementRef.nativeElement.innerText,
      'Tel',
      'E-mail',
    ];
  }

  clearFilter() {
    this.filter = {} as AcronymFilter;
    this.applyFilter();
  }

  applyFilter() {
    let harvestingsFiltered = this.harvestings;
    harvestingsFiltered = this.harvestings.filter((x) => {
      return  (!this.filter.id || x.id == this.filter.id) 
              && (!this.filter.institutionAcronym || x.name.toUpperCase().includes(this.filter.institutionAcronym?.toUpperCase())) 
              &&(!this.filter.institutionName || x.name.toUpperCase().includes(this.filter.institutionName?.toUpperCase())) 
              &&(!this.filter.acronym || x.name.toUpperCase().includes(this.filter.acronym?.toUpperCase())) 
              && (!this.filter.name || x.name.toUpperCase().includes(this.filter.name?.toUpperCase()));
    });

    this.loadData(harvestingsFiltered);
  }
}
