import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RulesListComponent } from './rules-list/rules-list.component';
import { EvaluationRulesComponent } from './evaluation-rules/evaluation-rules.component';

@NgModule({
  declarations: [EvaluationRulesComponent, RulesListComponent],
  imports: [SharedModule, MatDialogModule, MatListModule],
  exports: [EvaluationRulesComponent, RulesListComponent],
})
export class RuleModule {}
