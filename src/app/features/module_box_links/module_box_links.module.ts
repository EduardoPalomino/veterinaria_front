import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {UiControlModule} from "../controles/ui-control.module";
// Componentes
import { Module_box_linkListComponent } from './pages/list/list.component';


@NgModule({
  declarations: [
    Module_box_linkListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    UiControlModule
  ],
  providers: [

  ],
  exports: [
    Module_box_linkListComponent,
    UiControlModule
  ]
})
export class Module_box_linksModule {}
