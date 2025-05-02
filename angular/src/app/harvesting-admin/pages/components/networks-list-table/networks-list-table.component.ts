import { Component, OnInit } from '@angular/core';
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
export class NetworksListTableComponent implements OnInit {

  networksList: Network[];
  pageSize: number = 10;
  pageNumber: number;
  isLoading: boolean = false;
  totalRecords: number;

  selectedNetworks: Network[] = [];
  selectedNetworkIDs: Set<number> = new Set();

  actions: any[] = [];



  public filter: any = {
    sortField: '',
    sortOrder: 1,
  };


  constructor(private harvestingAdminList: HarvestingAdminService,
    private router: Router) { }



  ngOnInit(): void {

    this.actions = [
      {
        workers: ["harvestingWorker"],
        incremental: true,
        properties: [
          { name: "FORCE_FULL_HARVESTING", description: "Force full harvesting?" }
        ],
        runOnSchedule: true,
        allwaysRunOnSchedule: true,
        name: "HARVESTING_ACTION",
        description: "Harvesting"
      },
      {
        workers: ["validationWorker"],
        incremental: true,
        properties: [
          { name: "DETAILED_DIAGNOSE", description: "Perform detailed diagnostics (occurrences)" }
        ],
        runOnSchedule: true,
        allwaysRunOnSchedule: true,
        name: "VALIDATION_ACTION",
        description: "Validation/Transf"
      },
      {
        workers: ["frontendIndexerWorker"],
        incremental: true,
        properties: [
          { name: "INDEX_FRONTEND", description: "Index on frontend?" },
          { name: "INDEX_FULLTEXT", description: "Index full text?" }
        ],
        runOnSchedule: true,
        allwaysRunOnSchedule: false,
        name: "FRONTEND_INDEXING_ACTION",
        description: "Index Frontend"
      },
      {
        workers: ["frontendDeleteWorker"],
        incremental: false,
        properties: [],
        runOnSchedule: false,
        allwaysRunOnSchedule: false,
        name: "FRONTEND_DELETE_ACTION",
        description: "UnIndex Frontend"
      },
      {
        workers: ["xoaiIndexerWorker"],
        incremental: true,
        properties: [
          { name: "INDEX_XOAI", description: "Export to OAI-PMH Provider?" }
        ],
        runOnSchedule: true,
        allwaysRunOnSchedule: false,
        name: "XOAI_INDEXING_ACTION",
        description: "Index OAI-PMH"
      },
      {
        workers: ["xoaiDeleteWorker"],
        incremental: false,
        properties: [],
        runOnSchedule: false,
        allwaysRunOnSchedule: false,
        name: "XOAI_DELETE_ACTION",
        description: "UnIndex OAI-PMH"
      },
      {
        workers: ["networkCleanWorker"],
        incremental: false,
        properties: [
          { name: "CLEAN_NETWORK", description: "Clean old snapshots?" }
        ],
        runOnSchedule: true,
        allwaysRunOnSchedule: false,
        name: "NETWORK_CLEAN_ACTION",
        description: "Clean snapshots"
      },
      {
        workers: ["networkDeleteWorker"],
        incremental: false,
        properties: [],
        runOnSchedule: false,
        allwaysRunOnSchedule: false,
        name: "NETWORK_DELETE_ACTION",
        description: "Clean network (!)"
      }
    ];


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

  isSelected(id: number): boolean {
    return this.selectedNetworkIDs.has(id);
  }

  toggleSelection(id: number): void {
    if (this.selectedNetworkIDs.has(id)) {
      this.selectedNetworkIDs.delete(id);
    } else {
      this.selectedNetworkIDs.add(id);
    }
  }

  getSelectedNetworks(): Network[] {
    return this.networksList.filter(network => this.selectedNetworkIDs.has(network.networkID));
  }

}
