import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MascotaListComponent } from './pages/list/list.component';

const routes: Routes = [
  { path: '', component: MascotaListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MascotasRoutingModule { }