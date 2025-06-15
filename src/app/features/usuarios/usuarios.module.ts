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

// PrimeNG Services
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
// Componentes
import { UsuarioListComponent } from './pages/list/list.component';
import { FormComponent } from './pages/form/form.component';

// Servicios
import { UsuarioService } from './services/usuario.service';
import {CalendarModule} from "primeng/calendar";
import {Menu_topsModule} from "../menu_tops/menu_tops.module";
import {Module_box_titlesModule} from "../module_box_titles/module_box_titles.module";

@NgModule({
  declarations: [
    UsuarioListComponent,
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
        Menu_topsModule,
        Module_box_titlesModule
    ],
  providers: [
    MessageService,
    ConfirmationService,
    UsuarioService
  ],
  exports: [
    UsuarioListComponent,
    FormComponent
  ]
})
export class UsuariosModule {}
