import { Component, OnInit } from '@angular/core';

import { ManageGroupsService } from './../../../core/services/manage-groups.service';

import { Group } from './../../../shared/models/group.model';

import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-group-table',
  templateUrl: './group-table.component.html',
  styleUrls: ['./group-table.component.css'],
  providers:[ConfirmationService]
})
export class GroupTableComponent implements OnInit  {
 
  public dataSource: any;
  public displayedColumns = ['name', 'button-delete'];
  public csvData: any[];
  public headerData: any[];
  public nameFilter: string;
  public groups: Group[];
  public isLoadingData = true;


  constructor(
    private manageGroupsService: ManageGroupsService,
    private confirmationService: ConfirmationService
  ) {}
  
  ngOnInit(): void {
    this.loadRecords();
  }

  private loadData(groups: Group[]) {
    this.dataSource = groups;

    this.csvData = groups.map((x) => ({ name: x.name }));
    this.headerData = ['Name'];
  }

  loadRecords() {
    this.isLoadingData = true;
    this.manageGroupsService.getGroupList().subscribe((group) => {
      this.isLoadingData = false;
      this.loadData(group);
    });
  }

  onDeleteUser(event: Event, group: Group) {
    this.confirmationService.confirm({
        target: event.target,
        message: `You going to delete ${group.name} user, are you sure?`,
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.manageGroupsService.deleteGroup(group.name).subscribe(() =>{
            this.loadRecords();
          })
        },
        reject: () => {
        }
    });
  }
}
