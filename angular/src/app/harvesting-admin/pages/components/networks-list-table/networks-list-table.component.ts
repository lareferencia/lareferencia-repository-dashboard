import { Component } from '@angular/core';
import { LazyLoadEvent, SortEvent } from 'primeng/api';
import { HarvestingAdminService } from 'src/app/core/services/harvesting-admin.service';
import { Network } from 'src/app/shared/models/harvesting-admin.model';
import { Router } from '@angular/router';
import { NetworksDashboardComponent } from './components/networks-dashboard/networks-dashboard.component';

@Component({
  selector: 'networks-list-table',
  templateUrl: './networks-list-table.component.html',
  styleUrls: ['./networks-list-table.component.css'],
})
export class NetworksListTableComponent {

  networksList: Network[];
  pageSize: number = 10;
  pageNumber: number;
  isLoading: boolean = false;
  totalRecords: number;


  public filter: any = {
    sortField: '',
    sortOrder: 1,
  };


  constructor( private harvestingAdminList: HarvestingAdminService,
    private router: Router) { }


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

  clearFilters() {
    this.filter = {};
    this.applyFilter();
  }

  applyFilter() {
    this.loadContent({ first: 0, rows: this.pageSize });
  }

  loadContent(event: LazyLoadEvent) {
    this.filter = {
      ...this.filter,
      pageSize: event.rows,
      pageNumber: event.first / event.rows,
    };

    this.harvestingAdminList.getNetworkList(this.filter)
      .subscribe((data) => {
        this.totalRecords = data.totalElements;
        this.networksList = data.networks;        
      });
  }

}
