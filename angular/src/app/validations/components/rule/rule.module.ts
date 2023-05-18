import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';

import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

import { EvaluationRulesComponent } from './evaluation-rules/evaluation-rules.component';

@NgModule({
  declarations: [EvaluationRulesComponent],
  imports: [
    SharedModule,
    MaterialModule,
    HighlightModule,
  ],
  exports: [
    EvaluationRulesComponent,
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
