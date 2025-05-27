import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {UiControlModule} from "../controles/ui-control.module";

// Componentes
import { ProductoListComponent } from './pages/list/list.component';
import { FormComponent } from './pages/form/form.component';
import {Menu_topsModule} from "../menu_tops/menu_tops.module";
import {Module_box_titlesModule} from "../module_box_titles/module_box_titles.module";
import {Module_box_linksModule} from "../module_box_links/module_box_links.module";
// Servicios
import { ProductoService } from './services/producto.service';


@NgModule({
  declarations: [
    ProductoListComponent,
    FormComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        UiControlModule,
        Menu_topsModule,
        Module_box_titlesModule,
        Module_box_linksModule
    ],
  providers: [
    //MessageService,
    //ConfirmationService,
    ProductoService
  ],
  exports: [
    UiControlModule,
    ProductoListComponent,
    FormComponent,
    Module_box_linksModule
  ]
})
export class ProductosModule {}
