import { UserInfo } from 'src/app/shared/models/user-info.model';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent {
  @Input() users: UserInfo[] = [];
}
