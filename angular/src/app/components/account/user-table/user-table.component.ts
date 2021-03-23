import { DeleteConfirmationComponent } from './../delete-confirmation/delete-confirmation.component';
import { ManageUsersService } from './../../../core/services/manage-users.service';
import { AfterViewInit, Component, EventEmitter, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { delay, startWith, tap } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user.model';
import { UserTableDataSource } from './user-table-datasource';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css'],
})
export class UserTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<User>;
  @ViewChild('username') username: any;
  @Input() update: EventEmitter<void> = new EventEmitter();
  dataSource: UserTableDataSource;
  displayedColumns = ['username', 'button-delete'];
  csvData: any[];
  headerData: any[];
  usernameFilter: string;
  users: User[];

  constructor(
    private manageUsersService: ManageUsersService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.update.subscribe(() => this.loadRecords());
  }

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
    this.manageUsersService.getRegularUserList().subscribe((users) => {
      this.users = users.sort((a, b) => (a.username < b.username ? -1 : 1));
      this.loadData(this.users);
    });
  }

  private loadData(users: User[]) {
    this.dataSource = new UserTableDataSource(users);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.paginator.length = users.length;

    this.csvData = users.map((x) => ({ username: x.username }));
    this.headerData = [this.username._elementRef.nativeElement.innerText];
  }

  deleteClick(user: User): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      data: user.username,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result)
        this.manageUsersService.deleteUser(user.username).subscribe(() => {
          this.loadRecords();
        });
    });
  }

  applyFilter() {
    let userFiltered = this.users;
    if (!!this.usernameFilter?.trim()) {
      userFiltered = this.users.filter((x) =>
        x.username.includes(this.usernameFilter)
      );
    }
    this.loadData(userFiltered);
  }
}
