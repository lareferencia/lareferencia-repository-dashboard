import { NavService } from 'src/app/services/nav.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(private navService: NavService) {}

  ngOnInit(): void {}

  get acronym(): string {
    return this.navService.navData.acronym;
  }
}
