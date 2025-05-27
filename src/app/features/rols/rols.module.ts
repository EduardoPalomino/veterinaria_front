import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {UiControlModule} from "../controles/ui-control.module";
// PrimeNG
/*import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';*/
// PrimeNG Services
/*import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';*/

// Componentes
import { RolListComponent } from './pages/list/list.component';
import { FormComponent } from './pages/form/form.component';
import {Menu_topsModule} from "../menu_tops/menu_tops.module";
import {Module_box_titlesModule} from "../module_box_titles/module_box_titles.module";
import {Module_box_linksModule} from "../module_box_links/module_box_links.module";
import {Module_box_buttonsModule} from "../module_box_buttons/module_box_buttons.module";

// Servicios
import { RolService } from './services/rol.service';
//import {CalendarModule} from "primeng/calendar";

@NgModule({
  declarations: [
    RolListComponent,
    FormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    UiControlModule,
    Module_box_titlesModule,
    Module_box_buttonsModule,
    Module_box_linksModule,
    Menu_topsModule
    /*TableModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule,
    CalendarModule*/
  ],
  providers: [
    //MessageService,
    //ConfirmationService,
    RolService
  ],
  exports: [
    RolListComponent,
    FormComponent,
    UiControlModule,
    Module_box_titlesModule,
    Module_box_buttonsModule,
    Module_box_linksModule,
    Menu_topsModule
  ]
})
export class RolsModule {}
