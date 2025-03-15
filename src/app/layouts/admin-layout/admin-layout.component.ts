import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {

  isCollapsed = false;
  isDarkMode = false;
  menuItems: MenuItem[] = [];
  userMenu: MenuItem[] = [];

  ngOnInit() {
    this.menuItems = [
      { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/admin/dashboard' },
      {
        label: 'Usuarios',
        icon: 'pi pi-users',
        items: [
          { label: 'Listado', icon: 'pi pi-list', routerLink: '/admin/users' },
          { label: 'Crear Usuario', icon: 'pi pi-user-plus', routerLink: '/admin/users/create' }
        ]
      },
      {
        label: 'Roles',
        icon: 'pi pi-lock',
        items: [
          { label: 'Listado de Roles', icon: 'pi pi-list', routerLink: '/admin/rols' },
          { label: 'Crear Rol', icon: 'pi pi-plus-circle', routerLink: '/admin/roles/create' }
        ]
      },
      {
        label: 'Clientes',
        icon: 'pi pi-id-card',
        items: [
          { label: 'Lista de Clientes', icon: 'pi pi-list', routerLink: '/admin/clientes/lista' },
          { label: 'Nuevo Cliente', icon: 'pi pi-plus', routerLink: '/admin/clientes/nuevo' }
        ]
      },
      {
        label: 'Ventas',
        icon: 'pi pi-shopping-cart',
        items: [
          { label: 'Registrar Venta', icon: 'pi pi-plus', routerLink: '/admin/ventas/nueva' },
          { label: 'Historial de Ventas', icon: 'pi pi-clock', routerLink: '/admin/ventas/historial' }
        ]
      },
      {
        label: 'Productos',
        icon: 'pi pi-box',
        items: [
          { label: 'Lista de Productos', icon: 'pi pi-list', routerLink: '/admin/productos/lista' },
          { label: 'Categorías', icon: 'pi pi-tags', routerLink: '/admin/productos/categorias' }
        ]
      },
      {
        label: 'Compras',
        icon: 'pi pi-shopping-bag',
        items: [
          { label: 'Registrar Compra', icon: 'pi pi-plus', routerLink: '/admin/compras/nueva' },
          { label: 'Historial de Compras', icon: 'pi pi-clock', routerLink: '/admin/compras/historial' }
        ]
      },
      {
        label: 'Proveedores',
        icon: 'pi pi-truck',
        items: [
          { label: 'Lista de Proveedores', icon: 'pi pi-list', routerLink: '/admin/proveedores/lista' },
          { label: 'Nuevo Proveedor', icon: 'pi pi-plus', routerLink: '/admin/proveedores/nuevo' }
        ]
      },
      {
        label: 'Reportes',
        icon: 'pi pi-chart-line',
        items: [
          { label: 'Reporte de Ventas', icon: 'pi pi-chart-bar', routerLink: '/admin/reportes/ventas' },
          { label: 'Reporte de Compras', icon: 'pi pi-chart-bar', routerLink: '/admin/reportes/compras' },
          { label: 'Reporte de Inventario', icon: 'pi pi-chart-bar', routerLink: '/admin/reportes/inventario' }
        ]
      },
      { label: 'Configuración', icon: 'pi pi-cog', routerLink: '/admin/configuracion' }
    ];

    this.userMenu = [
      { label: 'Perfil', icon: 'pi pi-user', routerLink: '/admin/perfil' },
      { label: 'Cerrar Sesión', icon: 'pi pi-power-off', command: () => this.logout() }
    ];
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }

  logout() {
    console.log('Cerrando sesión...');
  }
}
