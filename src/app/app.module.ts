import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { ToolbarModule } from 'primeng/toolbar';
import { RippleModule } from 'primeng/ripple';

import { FormsModule } from '@angular/forms';

// Importa el nuevo LayoutsModule
import { LayoutsModule } from './layouts/layouts.module';
import { UsuariosModule } from './features/usuarios/usuarios.module';
import { RolsModule } from './features/rols/rols.module';
import { ClientesModule } from './features/clientes/clientes.module';
import { SexosModule } from './features/sexos/sexos.module';
import { EspeciesModule } from './features/especies/especies.module';
import { RazasModule } from './features/razas/razas.module';
import { MascotasModule } from './features/mascotas/mascotas.module';

import { ProveedorsModule } from './features/proveedors/proveedors.module';
import { Categoria_productosModule } from './features/categoria_productos/categoria_productos.module';
import { ProductosModule } from './features/productos/productos.module';
import { ComprasModule } from './features/compras/compras.module';
import { Detalle_comprasModule } from './features/detalle_compras/detalle_compras.module';
import { VentasModule } from './features/ventas/ventas.module';
import { Detalle_ventasModule } from './features/detalle_ventas/detalle_ventas.module';
import { Historia_clinicasModule } from './features/historia_clinicas/historia_clinicas.module';
import { ReportesModule } from './features/reportes/reportes.module';
import { DashboardsModule } from './features/dashboards/dashboards.module';
import {UsuarioListComponent} from "./features/usuarios/pages/list/list.component";
import {InventariosModule} from "./features/inventarios/inventarios.module";
import {LoginsModule} from "./features/logins/logins.module";
import {PagosModule} from "./features/pagos/pagos.module";
import {PagesModule} from "./features/pages/pages.module";
import {AccesosModule} from "./features/accesos/accesos.module";
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LayoutsModule,
    UsuariosModule,
    RolsModule,
    ClientesModule,
    EspeciesModule,
    RazasModule,
    MascotasModule,
    SexosModule,
    ProveedorsModule,
    Categoria_productosModule,
    ProductosModule,
    ComprasModule,
    Detalle_comprasModule,
    VentasModule,
    Detalle_ventasModule,
    Historia_clinicasModule,
    ReportesModule,
    DashboardsModule,
    InventariosModule,
    LoginsModule,
    PagosModule,
    PagesModule,
    AccesosModule,
    CalendarModule,
    TableModule,
    CardModule,
    SidebarModule,
    ButtonModule,
    MenuModule,
    PanelModule,
    DividerModule,
    ToolbarModule,
    RippleModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
