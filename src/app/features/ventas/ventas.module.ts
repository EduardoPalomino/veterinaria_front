import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// PrimeNG
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';

// PrimeNG Services
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
// Componentes
import { VentaListComponent } from './pages/list/list.component';
import { FormComponent } from './pages/form/form.component';

// Servicios
import { VentaService } from './services/venta.service';
import {InputNumberModule} from "primeng/inputnumber";

@NgModule({
  declarations: [
    VentaListComponent,
    FormComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        TableModule,
        CardModule,
        ButtonModule,
        InputTextModule,
        DialogModule,
        DropdownModule,
        ToastModule,
        ConfirmDialogModule,
        CalendarModule,
        InputNumberModule
    ],
  providers: [
    MessageService,
    ConfirmationService,
    VentaService
  ],
  exports: [
    VentaListComponent,
    FormComponent
  ]
})
export class VentasModule {}
