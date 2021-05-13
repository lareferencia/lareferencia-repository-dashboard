import { NavService } from 'src/app/core/services/nav.service';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  userName: string;

  constructor(
    private navService: NavService,
    private authenticationService: AuthenticationService
  ) {}

  async ngOnInit(): Promise<void> {
    this.userName = await this.authenticationService.getFirstName();
  }

  get acronym(): string {
    return this.navService.navData.acronym;
  }

  logout() {
    this.authenticationService.logout();
  }
}
