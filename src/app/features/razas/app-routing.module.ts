import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RazaListComponent } from './pages/list/list.component';

const routes: Routes = [
  { path: '', component: RazaListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RazasRoutingModule { }