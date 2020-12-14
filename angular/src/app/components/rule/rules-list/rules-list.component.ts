import { Component, OnInit, Input } from '@angular/core';
import { Rule } from 'src/app/shared/models/rule.model';

@Component({
  selector: 'app-rules-list',
  templateUrl: './rules-list.component.html',
  styleUrls: ['./rules-list.component.css'],
})
export class RulesListComponent implements OnInit {
  @Input() rules: Rule[];
  constructor() {}

  ngOnInit(): void {}
}
