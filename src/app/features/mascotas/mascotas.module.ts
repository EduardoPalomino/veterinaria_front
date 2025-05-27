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
import { MascotaListComponent } from './pages/list/list.component';
import { FormComponent } from './pages/form/form.component';

// Servicios
import { MascotaService } from './services/mascota.service';
import {ImageModule} from "primeng/image";
import {Menu_topsModule} from "../menu_tops/menu_tops.module";
import {Module_box_linksModule} from "../module_box_links/module_box_links.module";
import {Module_box_titlesModule} from "../module_box_titles/module_box_titles.module";

@NgModule({
  declarations: [
    MascotaListComponent,
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
    ImageModule,
    Menu_topsModule,
    Module_box_linksModule,
    Module_box_titlesModule
  ],
  providers: [
    MessageService,
    ConfirmationService,
    MascotaService
  ],
  exports: [
    MascotaListComponent,
    FormComponent
  ]
})
export class MascotasModule {}
