import { CardComponent } from './card/card.component';
import { TableExporterComponent } from './table-exporter/table-exporter.component';
import { VegaVizComponent } from './vega-viz/vega-viz.component';
import { MiniCardComponent } from './mini-card/mini-card.component';
import { PreventDoubleClickDirective } from '../directives/app-prevent-double-click.directive';
import { ValidationCardComponent } from './validation-card/validation-card.component';
import { InfoCardComponent } from './info-card/info-card.component';
import { RuleCardComponent } from './rule-card/rule-card.component';

export const components: any[] = [
  CardComponent,
  TableExporterComponent,
  VegaVizComponent,
  MiniCardComponent,
  PreventDoubleClickDirective,
  ValidationCardComponent,
  InfoCardComponent,
  RuleCardComponent
];

export * from './card/card.component';
export * from './table-exporter/table-exporter.component';
export * from './vega-viz/vega-viz.component';
export * from './mini-card/mini-card.component';
export * from './validation-card/validation-card.component';
export * from './info-card/info-card.component';
export * from './rule-card/rule-card.component';
