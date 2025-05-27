import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Componentes
import { Module_box_titleListComponent } from './pages/list/list.component';


@NgModule({
  declarations: [
    Module_box_titleListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [

  ],
  exports: [
    Module_box_titleListComponent
  ]
})
export class Module_box_titlesModule {}
