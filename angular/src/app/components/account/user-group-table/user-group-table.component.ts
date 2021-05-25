import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { UserGroup } from './../../../shared/models/user-group-action.model';
import { UserGroupAction } from './../../../shared/enums/user-group-action';
import { ManageGroupsService } from './../../../core/services/manage-groups.service';
import { Group } from './../../../shared/models/group.model';
import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { UserGroupTableDataSource } from './user-group-table-datasource';
import { delay, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'app-user-group-table',
  templateUrl: './user-group-table.component.html',
  styleUrls: ['./user-group-table.component.css'],
})
export class UserGroupTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Group>;
  @ViewChild('name') name: any;
  @Input() action: UserGroupAction;
  @Input() username: string;
  @Output() actionClick = new EventEmitter<UserGroup>();
  dataSource: UserGroupTableDataSource;
  userGroupAction = UserGroupAction;
  displayedColumns = ['name', 'button-action'];
  nameFilter: string;
  groups: Group[];

  constructor(
    private manageGroupsService: ManageGroupsService,
    private manageUsersService: ManageUsersService
  ) {}

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

  private loadData(groups: Group[]) {
    this.dataSource = new UserGroupTableDataSource(groups);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.paginator.length = groups.length;
  }

  loadRecords() {
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
    this.actionClick.emit({ groupname: group.name, action: this.action });
  }

  applyFilter() {
    let userFiltered = this.groups;
    if (!!this.nameFilter?.trim()) {
      userFiltered = this.groups.filter((x) =>
        x.name.toUpperCase().includes(this.nameFilter.toUpperCase())
      );
    }
    this.loadData(userFiltered);
  }
}
