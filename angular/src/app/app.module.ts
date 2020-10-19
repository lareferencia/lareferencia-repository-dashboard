import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

import { HeaderComponent } from './components/template/header/header.component';
import { FooterComponent } from './components/template/footer/footer.component';
import { NavComponent } from './components/template/nav/nav.component';
import { ValidationDetailComponent } from './components/validation/validation-detail/validation-detail.component';
import { ValidationTableComponent } from './components/validation/validation-table/validation-table.component';
import { HomeComponent } from './views/home/home.component';
import { ValidationComponent } from './views/validation/validation.component';
import { RedDirective } from './directives/red.directive';
import { HarvestingSourceComponent } from './components/harvesting/harvesting-source/harvesting-source.component';
import { HarvestingTableComponent } from './components/harvesting/harvesting-table/harvesting-table.component';
import { HarvestingComponent } from './views/harvesting/harvesting.component';
import { InvalidOccurenceTableComponent } from './components/occurrence/invalid-occurence-table/invalid-occurence-table.component';
import { ValidOccurenceTableComponent } from './components/occurrence/valid-occurence-table/valid-occurence-table.component';
import { RecordsValidTableComponent } from './components/records/records-valid-table/records-valid-table.component';
import { RecordsInvalidTableComponent } from './components/records/records-invalid-table/records-invalid-table.component';
import { RecordValidComponent } from './views/record-valid/record-valid.component';
import { RecordInvalidComponent } from './views/record-invalid/record-invalid.component';
import { EvaluationRulesComponent } from './components/evaluation-rules/evaluation-rules.component';
import { ScoreChartComponent } from './components/score-chart/score-chart.component';
import { VegaVizComponent } from './components/vega-viz/vega-viz.component';
import { NavBarComponent } from './components/template/nav-bar/nav-bar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon';
import { DashComponent } from './views/dash/dash.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { RulesListComponent } from './components/rules-list/rules-list.component';
import { DashMiniCardComponent } from './components/dash-mini-card/dash-mini-card.component';
import { ConformityChartComponent } from './components/conformity-chart/conformity-chart.component';
import { RecordsTableComponent } from './components/records/records-table/records-table.component';
import { TableExporterComponent } from './components/table-exporter/table-exporter.component';
import { ConformityGroupedChartComponent } from './components/conformity-grouped-chart/conformity-grouped-chart.component';
import { ValidationChartComponent } from './components/validation/validation-chart/validation-chart.component';
import { SubHeaderComponent } from './components/sub-header/sub-header.component';
import { CardComponent } from './components/card/card.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
    HomeComponent,
    ValidationComponent,
    RedDirective,
    ValidationTableComponent,
    ValidationDetailComponent,
    HarvestingSourceComponent,
    HarvestingTableComponent,
    HarvestingComponent,
    InvalidOccurenceTableComponent,
    ValidOccurenceTableComponent,
    RecordsValidTableComponent,
    RecordsInvalidTableComponent,
    RecordValidComponent,
    RecordInvalidComponent,
    EvaluationRulesComponent,
    ScoreChartComponent,
    VegaVizComponent,
    NavBarComponent,
    DashComponent,
    RulesListComponent,
    DashMiniCardComponent,
    ConformityChartComponent,
    RecordsTableComponent,
    TableExporterComponent,
    ConformityGroupedChartComponent,
    ValidationChartComponent,
    SubHeaderComponent,
    CardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatProgressBarModule,
    MatSortModule,
    MatTableModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatPaginatorModule,
    MatTooltipModule,
    LayoutModule,
    MatIconModule,
    MatGridListModule,
    MatMenuModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
