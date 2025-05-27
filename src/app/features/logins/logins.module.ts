import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {UiControlModule} from "../controles/ui-control.module";
// PrimeNG


// PrimeNG Services

// Componentes
import { LoginListComponent } from './pages/list/list.component';

// Servicios

@NgModule({
  declarations: [
    LoginListComponent,
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
    LoginListComponent
  ]
})
export class LoginsModule {}
