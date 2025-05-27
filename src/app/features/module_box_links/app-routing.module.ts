import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Module_box_linkListComponent } from './pages/list/list.component';

const routes: Routes = [
  { path: '', component: Module_box_linkListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Module_box_linksRoutingModule { }