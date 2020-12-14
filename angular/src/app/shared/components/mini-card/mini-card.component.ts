import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mini-card',
  templateUrl: './mini-card.component.html',
  styleUrls: ['./mini-card.component.css'],
})
export class MiniCardComponent implements OnInit {
  @Input() icon: string;
  @Input() title: string;
  @Input() content: string;
  @Input() color: string;

  constructor() {}

  ngOnInit(): void {}
}
