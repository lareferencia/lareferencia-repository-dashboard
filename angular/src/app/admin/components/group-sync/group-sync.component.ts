import { ProcessListComponent } from './../process-list/process-list.component';
import { ManageGroupsService } from './../../../core/services/manage-groups.service';
import { GroupInfo } from 'src/app/shared/models/group-info.model';
import { ProcessInfo } from '../../../shared/models/process-info.model';
import { HarvestingService } from './../../../core/services/harvesting.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProcessStatus } from 'src/app/shared/enums/process-status';

@Component({
  selector: 'app-group-sync',
  templateUrl: './group-sync.component.html',
  styleUrls: ['./group-sync.component.css'],
})
export class GroupSyncComponent implements OnInit {
  @ViewChild(ProcessListComponent) processListChild: ProcessListComponent; 
  process: ProcessInfo[] = [];
  groups: GroupInfo[] = [];

  constructor(
    private harvestingService: HarvestingService,
    private manageGroupsService: ManageGroupsService
  ) {}

  ngOnInit(): void {}

  onClickSync() {
    this.process = [];
    this.harvestingService.getHarvestingList().subscribe((result) => {
      result.content.forEach((element) => {
        this.groups.push({ name: element.acronym, long_name: element.name });
        this.process.push({ description: element.acronym });
      });

      this.manageGroups(this.groups);
    });
  }

  private manageGroups(groups: GroupInfo[]) {
    groups.forEach((group) => {
      this.manageGroupsService.getGroup(group.name).subscribe(
        () => {
          this.manageGroupsService.updateGroup(group.name, group).subscribe(
            (result) => this.processListChild.onUpdateStatus({description: group.name, status: result ? ProcessStatus.Success: ProcessStatus.Error}),
            () => this.processListChild.onUpdateStatus({description: group.name, status: ProcessStatus.Error})
          );
        },
        () => {
          this.manageGroupsService.createGroup(group).subscribe(
            (result) => this.processListChild.onUpdateStatus({description: group.name, status: result ? ProcessStatus.Success: ProcessStatus.Error}),
            () => this.processListChild.onUpdateStatus({description: group.name, status: ProcessStatus.Error})
          );
        }
      );
    });
  }
}
