import { Component, OnInit } from '@angular/core';
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private navService: NavService) {
    this.navService.navData = {
      harvestingID: 0,
      acronym: '',
    };
  }

  ngOnInit(): void {}
}
