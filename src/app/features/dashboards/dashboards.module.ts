import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {UiControlModule} from "../controles/ui-control.module";

// Componentes
import { DashboardListComponent } from './pages/list/list.component';


// Servicios

@NgModule({
  declarations: [
    DashboardListComponent,

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
    DashboardListComponent,
    UiControlModule
  ]
})
export class DashboardsModule {}
