import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VentaListComponent } from './pages/list/list.component';

const routes: Routes = [
  { path: '', component: VentaListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }