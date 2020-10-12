import { Rule } from './../../../shared/rule.model';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-validation-detail',
  templateUrl: './validation-detail.component.html',
  styleUrls: ['./validation-detail.component.css'],
})
export class ValidationDetailComponent implements OnInit {
  rule: Rule;

  constructor(@Inject(MAT_DIALOG_DATA) data: Rule) {
    this.rule = data;
  }

  ngOnInit(): void {}
}
