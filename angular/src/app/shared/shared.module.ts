import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgModule } from '@angular/core';
import * as fromComponents from './components';
import * as fromDirectives from './directives';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { ValidationCardComponent } from './components/validation-card/validation-card.component';

@NgModule({
  declarations: [...fromComponents.components, ...fromDirectives.directives],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [
    FormsModule,
    CommonModule,
    MatProgressBarModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    ...fromComponents.components,
    ...fromDirectives.directives,
  ],
})
export class SharedModule {}
