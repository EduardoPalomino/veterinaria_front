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
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';*/

// PrimeNG Services
/*import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';*/
// Componentes
import { CompraListComponent } from './pages/list/list.component';
import { FormComponent } from './pages/form/form.component';
import {Menu_topsModule} from "../menu_tops/menu_tops.module";
import {Module_box_titlesModule} from "../module_box_titles/module_box_titles.module";
import {Module_box_linksModule} from "../module_box_links/module_box_links.module";
import {Module_box_buttonsModule} from "../module_box_buttons/module_box_buttons.module";
// Servicios
import { CompraService } from './services/compra.service';


@NgModule({
  declarations: [
    CompraListComponent,
    FormComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        UiControlModule,
        Menu_topsModule,
        Module_box_linksModule,
        Module_box_titlesModule,
       Module_box_buttonsModule
    ],
  providers: [
    CompraService
  ],
  exports: [
    CompraListComponent,
    FormComponent,
    UiControlModule,
    Menu_topsModule,
    Module_box_linksModule,
    Module_box_titlesModule,
    Module_box_buttonsModule
  ]
})
export class ComprasModule {}
