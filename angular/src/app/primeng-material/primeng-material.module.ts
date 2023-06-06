import { NgModule } from '@angular/core';

import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { AccordionModule } from 'primeng/accordion';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { MenuModule } from 'primeng/menu';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ConfirmPopupModule } from 'primeng/confirmpopup';


@NgModule({
    exports: [
    MatCardModule,
    MatSidenavModule,
    MatListModule,

    ProgressSpinnerModule,
    ToastModule,
    ChartModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    MultiSelectModule,
    AccordionModule,
    DialogModule,
    TagModule,
    TooltipModule,
    CalendarModule,
    MenuModule,
    KeyFilterModule,
    ConfirmPopupModule
    ],
})
export class PrimengMaterial { }
