import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

import { EvaluationRulesComponent } from './evaluation-rules/evaluation-rules.component';
import { PrimengMaterial } from 'src/app/primeng-material/primeng-material.module';

@NgModule({
  declarations: [EvaluationRulesComponent],
  imports: [
    SharedModule,
    PrimengMaterial,
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
