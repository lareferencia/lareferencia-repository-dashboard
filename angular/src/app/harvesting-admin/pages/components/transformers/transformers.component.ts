import { Component } from '@angular/core';
import { LazyLoadEvent, SortEvent } from 'primeng/api';
import { HarvestingAdminService } from 'src/app/core/services/harvesting-admin.service';

@Component({
  selector: 'transformers',
  templateUrl: './transformers.component.html',
  styleUrls: ['./transformers.component.css']
})
export class TransformersComponent {

   networksList: any[];
      pageSize: number = 10;
      pageNumber: number;
      isLoading: boolean = false;
      totalRecords: number;
    
    
      public filter: any = {
        sortField: '',
        sortOrder: 1,
      };
    
    
      constructor( private harvestingAdminList: HarvestingAdminService ) { }
    
    
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
