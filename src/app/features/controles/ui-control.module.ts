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
import { FileUploadModule } from 'primeng/fileupload';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { PaginatorModule } from 'primeng/paginator';
import { ImageModule } from 'primeng/image';
import { ChartModule } from 'primeng/chart';
import { TabViewModule } from 'primeng/tabview';
import { PanelModule } from 'primeng/panel';


// PrimeNG Services
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
// Componentes


@NgModule({
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
    FileUploadModule,
    RadioButtonModule,
    InputSwitchModule,
    InputTextareaModule,
    CheckboxModule,
    PaginatorModule,
    ImageModule,
    ChartModule,
    TabViewModule,
    PanelModule,

  ],
  exports: [ // 👈 ¡Nueva sección para exportar módulos!
    // Módulos de Angular (opcional, si otros módulos los necesitan)
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // Módulos de PrimeNG
    TableModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule,
    CalendarModule,
    FileUploadModule,
    RadioButtonModule,
    InputSwitchModule,
    InputTextareaModule,
    CheckboxModule,
    PaginatorModule,
    ImageModule,
    ChartModule,
    TabViewModule,
    PanelModule,

  ],
  providers: [
    MessageService,
    ConfirmationService,
  ],

})
export class UiControlModule {}
