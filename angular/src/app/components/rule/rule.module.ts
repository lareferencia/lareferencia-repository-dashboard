import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SharedModule } from 'src/app/shared/shared.module';
import { RulesListComponent } from './rules-list/rules-list.component';
import { EvaluationRulesComponent } from './evaluation-rules/evaluation-rules.component';
import { MatTabsModule } from '@angular/material/tabs';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

@NgModule({
  declarations: [EvaluationRulesComponent, RulesListComponent],
  imports: [
    SharedModule,
    MatDialogModule,
    MatListModule,
    MatButtonToggleModule,
    HighlightModule,
    MatTabsModule,
  ],
  exports: [EvaluationRulesComponent, RulesListComponent],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          xml: () => import('highlight.js/lib/languages/xml'),
        },
      },
    },
  ],
})
export class RuleModule {}
