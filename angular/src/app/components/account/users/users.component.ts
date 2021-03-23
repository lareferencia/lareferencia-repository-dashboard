import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent {
  @Output() openedUserGroup: EventEmitter<void> = new EventEmitter();
  openUserGroup() {
    this.openedUserGroup.emit(null);
  }
}
