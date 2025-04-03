import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Categoria_productoListComponent } from './pages/list/list.component';

const routes: Routes = [
  { path: '', component: Categoria_productoListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Categoria_productosRoutingModule { }