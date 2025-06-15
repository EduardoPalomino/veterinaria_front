import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// ✅ Importa correctamente los componentes
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { UsuarioListComponent } from './features/usuarios/pages/list/list.component';  // <- Asegúrate de que sea el nombre correcto de la carpeta y el componente
import { RolListComponent } from './features/rols/pages/list/list.component';
import { ClienteListComponent } from './features/clientes/pages/list/list.component';
import { MascotaListComponent } from './features/mascotas/pages/list/list.component';
import { SexoListComponent } from './features/sexos/pages/list/list.component';
import { EspecieListComponent } from './features/especies/pages/list/list.component';
import { RazaListComponent } from './features/razas/pages/list/list.component';
import { ProveedorListComponent } from './features/proveedors/pages/list/list.component';
import { Categoria_productoListComponent } from './features/categoria_productos/pages/list/list.component';
import { ProductoListComponent } from './features/productos/pages/list/list.component';
import { CompraListComponent } from './features/compras/pages/list/list.component';
import { Detalle_compraListComponent } from './features/detalle_compras/pages/list/list.component';
import { VentaListComponent } from './features/ventas/pages/list/list.component';
import { Detalle_ventaListComponent } from './features/detalle_ventas/pages/list/list.component';
import { Historia_clinicaListComponent } from './features/historia_clinicas/pages/list/list.component';
import { ReporteListComponent } from './features/reportes/pages/list/list.component';
import { DashboardListComponent } from './features/dashboards/pages/list/list.component';
import {InventarioListComponent} from "./features/inventarios/pages/list/list.component";
import {LoginListComponent} from "./features/logins/pages/list/list.component";
import {PagoListComponent} from "./features/pagos/pages/list/list.component";
import {PageListComponent} from "./features/pages/pages/list/list.component";
import {AccesoListComponent} from "./features/accesos/pages/list/list.component";
const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'  // <- Si entras a localhost:4200 te manda a /admin
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboards',
        pathMatch: 'full'  // <- Si entras a /admin te manda a /admin/users
      },
      {
        path: 'inventarios',
        component: InventarioListComponent
      },
      {
        path: 'login',
        component: LoginListComponent
      },
      {
        path: 'users',
        component: UsuarioListComponent
      },
      {
        path: 'dashboards',
        component: DashboardListComponent
      },
      {
        path:'rols',
        component:RolListComponent
      },
      {
        path:'clientes',
        component:ClienteListComponent
      },
      {
        path:'mascotas',
        component:MascotaListComponent
      },
      {
        path:'sexos',
        component:SexoListComponent
      },
      {
        path:'especies',
        component:EspecieListComponent
      },
      {
        path:'razas',
        component:RazaListComponent
      },
      {
        path:'proveedors',
        component:ProveedorListComponent
      },
      {
        path:'categoria_productos',
        component:Categoria_productoListComponent
      },
      {
        path:'productos',
        component:ProductoListComponent
      },
      {
        path:'compras',
        component:CompraListComponent
      },
      {
        path:'detalle_compras',
        component:Detalle_compraListComponent
      },
      {
        path:'ventas',
        component:VentaListComponent
      },
      {
        path:'detalle_ventas',
        component:Detalle_ventaListComponent
      },
      {
        path:'historia_clinicas',
        component:Historia_clinicaListComponent
      },
      {
        path:'reportes',
        component:ReporteListComponent
      },
      {
        path:'pagos',
        component:PagoListComponent
      },
      {
        path:'pages',
        component:PageListComponent
      },
      {
        path:'accesos',
        component:AccesoListComponent
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
