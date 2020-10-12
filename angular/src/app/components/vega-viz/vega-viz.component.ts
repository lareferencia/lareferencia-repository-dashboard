import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { View, Spec } from 'vega';
import { Handler } from 'vega-tooltip';
declare const vega: any;

@Component({
  selector: 'app-vega-viz',
  templateUrl: './vega-viz.component.html',
  styleUrls: ['./vega-viz.component.css'],
})
export class VegaVizComponent implements OnInit {
  @Input() id: string;
  @Output() outgoingData = new EventEmitter<View>();
  @Input() pathToData: string;
  view: View;

  constructor() {}
  public vegaInit(spec: Spec) {
    const tooltip = new Handler();

    this.view = new vega.View(vega.parse(spec))
      .renderer('svg')
      .initialize('#' + this.id)
      // .width(300)
      // .height(300)
      .hover()
      .tooltip(tooltip.call)
      .run();

    this.sendData(this.view);
  }

  public sendData(data: View) {
    this.outgoingData.emit(data);
  }

  ngOnInit() {
    vega
      .loader()
      .load(this.pathToData)
      .then((data: string) => {
        this.vegaInit(JSON.parse(data));
      });
  }
}
