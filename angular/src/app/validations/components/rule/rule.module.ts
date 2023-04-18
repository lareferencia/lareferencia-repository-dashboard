import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RulesListComponent } from './rules-list/rules-list.component';
import { EvaluationRulesComponent } from './evaluation-rules/evaluation-rules.component';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  declarations: [EvaluationRulesComponent, RulesListComponent],
  imports: [
    SharedModule,
    MaterialModule,
    HighlightModule,
  ],
  exports: [
    EvaluationRulesComponent,
    RulesListComponent
  ],
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
