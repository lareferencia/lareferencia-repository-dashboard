import { DeleteConfirmationComponent } from './../delete-confirmation/delete-confirmation.component';
import { ManageGroupsService } from './../../../core/services/manage-groups.service';
import { Group } from './../../../shared/models/group.model';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { GroupTableDataSource } from './group-table-datasource';
import { MatDialog } from '@angular/material/dialog';
import { delay, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'app-group-table',
  templateUrl: './group-table.component.html',
  styleUrls: ['./group-table.component.css'],
})
export class GroupTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Group>;
  @ViewChild('name') name: any;
  dataSource: GroupTableDataSource;
  displayedColumns = ['name', 'button-delete'];
  csvData: any[];
  headerData: any[];
  nameFilter: string;
  groups: Group[];

  constructor(
    private manageGroupsService: ManageGroupsService,
    private dialog: MatDialog
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
    this.dataSource = new GroupTableDataSource(groups);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.paginator.length = groups.length;

    this.csvData = groups.map((x) => ({ name: x.name }));
    this.headerData = [this.name._elementRef.nativeElement.innerText];
  }

  loadRecords() {
    this.manageGroupsService.getGroupList().subscribe((group) => {
      this.groups = group.sort((a, b) => (a.name < b.name ? -1 : 1));
      this.loadData(this.groups);
    });
  }

  deleteClick(group: Group): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      data: {type: "group", description: group.name},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result)
        this.manageGroupsService.deleteGroup(group.name).subscribe(() => {
          this.loadRecords();
        });
    });
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
