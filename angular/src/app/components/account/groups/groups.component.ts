import { ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { GroupTableComponent } from '../group-table/group-table.component';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
})
export class GroupsComponent {
  @ViewChild(GroupTableComponent) groupTableChild: GroupTableComponent;
  openExpanderGroup() {
    this.groupTableChild.loadRecords();
  }
}
