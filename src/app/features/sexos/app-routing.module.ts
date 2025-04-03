import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SexoListComponent } from './pages/list/list.component';

const routes: Routes = [
  { path: '', component: SexoListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SexosRoutingModule { }