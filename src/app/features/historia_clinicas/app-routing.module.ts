import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Historia_clinicaListComponent } from './pages/list/list.component';

const routes: Routes = [
  { path: '', component: Historia_clinicaListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Historia_clinicasRoutingModule { }