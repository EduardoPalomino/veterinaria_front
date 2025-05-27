import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {UiControlModule} from "../controles/ui-control.module";

// Componentes
import { Menu_topListComponent } from './pages/list/list.component';

@NgModule({
  declarations: [
    Menu_topListComponent
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
    Menu_topListComponent,
    UiControlModule
  ]
})
export class Menu_topsModule {}
