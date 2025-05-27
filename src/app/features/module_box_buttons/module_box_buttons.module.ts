import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {UiControlModule} from "../controles/ui-control.module";
// Componentes
import { Module_box_buttonListComponent } from './pages/list/list.component';


@NgModule({
  declarations: [
    Module_box_buttonListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiControlModule,
    HttpClientModule
  ],
  providers: [

  ],
  exports: [
    Module_box_buttonListComponent
  ]
})
export class Module_box_buttonsModule {}
