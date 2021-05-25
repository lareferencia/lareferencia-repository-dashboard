import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HarvestingService } from './../../../core/services/harvesting.service';
import { BrokerEvents } from './../../../shared/models/broker-events.model';
import { Harvesting } from '../../../shared/models/harvesting.model';

@Component({
  selector: 'app-broker',
  templateUrl: './broker.component.html',
  styleUrls: ['./broker.component.css'],
})
export class BrokerComponent implements OnInit {
  brokerEvents: BrokerEvents;
  isLoadingResults = true;
  harvesting: Harvesting;

  constructor(
    private route: ActivatedRoute,
    private harvestingService: HarvestingService
  ) {}

  ngOnInit(): void {
    const acronym = this.route.snapshot.paramMap.get('acronym');
    this.harvestingService
      .getHarvestingByAcronym(acronym)
      .subscribe((harvesting) => {
        this.harvesting = harvesting;
        this.isLoadingResults = false;
      });
  }
}
