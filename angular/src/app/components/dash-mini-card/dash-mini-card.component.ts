import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dash-mini-card',
  templateUrl: './dash-mini-card.component.html',
  styleUrls: ['./dash-mini-card.component.css'],
})
export class DashMiniCardComponent implements OnInit {
  @Input() icon: string;
  @Input() title: string;
  @Input() content: string;
  @Input() color: string;

  constructor() {}

  ngOnInit(): void {}
}
