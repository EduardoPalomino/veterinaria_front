import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {UiControlModule} from "../controles/ui-control.module";

// Componentes
import { ProveedorListComponent } from './pages/list/list.component';
import { FormComponent } from './pages/form/form.component';
import {Menu_topsModule} from "../menu_tops/menu_tops.module";
import {Module_box_titlesModule} from "../module_box_titles/module_box_titles.module";
import {Module_box_linksModule} from "../module_box_links/module_box_links.module";
import {Module_box_buttonsModule} from "../module_box_buttons/module_box_buttons.module";
// Servicios
import { ProveedorService } from './services/proveedor.service';

@NgModule({
  declarations: [
    ProveedorListComponent,
    FormComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        UiControlModule,
        Menu_topsModule,
        Module_box_buttonsModule,
        Module_box_linksModule,
        Module_box_titlesModule
    ],
  providers: [
    ProveedorService
  ],
  exports: [
    ProveedorListComponent,
    FormComponent,
    UiControlModule,
    Menu_topsModule,
    Module_box_buttonsModule,
    Module_box_linksModule,
    Module_box_titlesModule
  ]
})
export class ProveedorsModule {}
