import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Detalle_ventaListComponent } from './pages/list/list.component';

const routes: Routes = [
  { path: '', component: Detalle_ventaListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Detalle_ventasRoutingModule { }