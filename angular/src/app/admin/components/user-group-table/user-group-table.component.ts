import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { ManageGroupsService } from './../../../core/services/manage-groups.service';

import { UserGroup } from './../../../shared/models/user-group-action.model';
import { Group } from './../../../shared/models/group.model';
import { UserGroupAction } from './../../../shared/enums/user-group-action';

@Component({
  selector: 'app-user-group-table',
  templateUrl: './user-group-table.component.html',
  styleUrls: ['./user-group-table.component.css'],
})
export class UserGroupTableComponent implements OnInit {


  @Input() action: UserGroupAction;
  @Input() username: string;
  @Output() actionClick = new EventEmitter<UserGroup>();

  public dataSource: Group[];
  public userGroupAction = UserGroupAction;
  public displayedColumns = ['name', 'button-action'];
  public nameFilter: string;
  public groups: Group[];
  public loading = false;
  public isLoadingData = true;
  
  public leaveStyleClass = 'p-button-danger p-button-sm';
  public joinStyleClass = 'p-button-primary p-button-sm';

  constructor(
    private manageGroupsService: ManageGroupsService,
    private manageUsersService: ManageUsersService
  ) {}

  ngOnInit(): void {
    this.isLoadingData = true;
    this.loadRecords();
  }

  private loadData(groups: Group[]) {
    this.dataSource = groups;
    this.isLoadingData = false;
  }
  
  loadRecords() {
    this.loading = false;
    this.manageGroupsService.getGroupList().subscribe((groups) => {
      this.manageUsersService.getUserGroups(this.username)
        .subscribe((groupsUser) => {
          switch (this.action) {
            case UserGroupAction.Join:
              this.groups = groups.filter(x=> !groupsUser.some(y=> y.name == x.name));
              break;
            case UserGroupAction.Leave:
              this.groups = groups.filter(x=> groupsUser.some(y=> y.name == x.name));
              break;
          }
          this.loadData(this.groups);
        });
    });
  }

  handlerClick(group: Group): void {
    this.loading = true;
    this.actionClick.emit({ groupname: group.name, action: this.action });
  }
}
