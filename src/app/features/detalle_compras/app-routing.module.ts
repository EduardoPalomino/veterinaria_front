import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Detalle_compraListComponent } from './pages/list/list.component';

const routes: Routes = [
  { path: '', component: Detalle_compraListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Detalle_comprasRoutingModule { }