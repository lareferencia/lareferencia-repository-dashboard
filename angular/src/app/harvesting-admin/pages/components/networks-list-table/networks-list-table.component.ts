import { Component } from '@angular/core';
import { SortEvent } from 'primeng/api';
import { HarvestingAdminService } from 'src/app/core/services/harvesting-admin.service';
import { Network } from 'src/app/shared/models/harvesting-admin.model';

@Component({
  selector: 'networks-list-table',
  templateUrl: './networks-list-table.component.html',
  styleUrls: ['./networks-list-table.component.css']
})
export class NetworksListTableComponent {

  networksList: Network[];
  pageSize: number = 10;
  pageNumber: number;
  isLoading: boolean = false;
  totalRecords: number;


  public filter = {
    sortField: '',
    sortOrder: 1,
  };


  constructor( private harvestingAdminList: HarvestingAdminService) { }


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

  loadContent(event) {
    this.pageNumber = event.first / event.rows;
    this.pageSize = event.rows;

    this.harvestingAdminList.getNetworkList(this.pageNumber, this.pageSize)
      .subscribe((data) => {
        this.totalRecords = data.totalElements;
        this.networksList = data.networks;
      });
  }

}
