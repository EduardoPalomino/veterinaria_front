import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Menu_topListComponent } from './pages/list/list.component';

const routes: Routes = [
  { path: '', component: Menu_topListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Menu_topsRoutingModule { }