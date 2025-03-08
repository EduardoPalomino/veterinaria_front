import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// ✅ Importa correctamente los componentes
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { UserListComponent } from './features/users/pages/list/list.component';  // <- Asegúrate de que sea el nombre correcto de la carpeta y el componente

const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full'  // <- Si entras a localhost:4200 te manda a /admin
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'  // <- Si entras a /admin te manda a /admin/users
      },
      {
        path: 'users',
        component: UserListComponent
      }
    ]
  },
  { path: '**', redirectTo: 'admin' }  // cualquier ruta inválida te manda a /admin
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
