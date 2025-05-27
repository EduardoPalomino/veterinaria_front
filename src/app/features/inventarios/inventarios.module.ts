import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {UiControlModule} from "../controles/ui-control.module";
// Componentes
import { InventarioListComponent } from './pages/list/list.component';
import {Menu_topsModule} from "../menu_tops/menu_tops.module";
import {Module_box_buttonsModule} from "../module_box_buttons/module_box_buttons.module";
import {Module_box_linksModule} from "../module_box_links/module_box_links.module";
import {Module_box_titlesModule} from "../module_box_titles/module_box_titles.module";

// Servicios

@NgModule({
  declarations: [
    InventarioListComponent
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
  ],
  exports: [
    InventarioListComponent,
    UiControlModule,
    Menu_topsModule,
    Module_box_buttonsModule,
    Module_box_linksModule,
    Module_box_titlesModule
  ]
})
export class InventariosModule {}
