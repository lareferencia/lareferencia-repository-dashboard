import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgModule } from '@angular/core';
import * as fromComponents from './components';
import * as fromDirectives from './directives';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [...fromComponents.components, ...fromDirectives.directives],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule,
  ],
  exports: [
    FormsModule,
    CommonModule,
    MatProgressBarModule,
    MatCardModule,
    MatIconModule,
    ...fromComponents.components,
    ...fromDirectives.directives,
  ],
})
export class SharedModule {}
