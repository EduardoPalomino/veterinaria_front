import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';

import {Categoria_productoService} from "../../../categoria_productos/services/categoria_producto.service";
import { Detalle_ventaService } from '../../../detalle_ventas/services/detalle_venta.service';
import { Detalle_compraService } from '../../../detalle_compras/services/detalle_compra.service';
import { ProductoService } from '../../../productos/services/producto.service';
import {Categoria_producto} from "../../../categoria_productos/interfaces/categoria_producto.interface";
import { Detalle_venta } from '../../../detalle_ventas/interfaces/detalle_venta.interface';
import { Detalle_compra } from '../../../detalle_compras/interfaces/detalle_compra.interface';
import { Producto } from '../../../productos/interfaces/producto.interface';

interface kardex {
  _id: string;
  orden: number;
  producto: string;
  categoria_producto_id: string;
  tamano: string;
  fecha: string;
  tipo: string;
  cantidad: string;
  ope_monto: number;
}

@Component({
  selector: 'app-inventario-list',
  templateUrl: './list.component.html',
})
export class InventarioListComponent implements OnInit {
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  mode: string = '';
  filtroForm: FormGroup;

  detalle_ventas: Detalle_venta[] = [];
  detalle_compras: Detalle_compra[] = [];
  productos: Producto[] = [];
  categoria_productos: Categoria_producto[] = [];
  selected_categoria: { label: string; value: string }[] = [];
  itemsCompra: any = [];
  itemsIngresoCompra: kardex[] = [];
  itemsEngresoVenta: kardex[] = [];
  itemsKardex: kardex[] = [];

  constructor(
    private fb: FormBuilder,
    private categoria_productoService: Categoria_productoService,
    private detalle_ventaService: Detalle_ventaService,
    private detalle_compraService: Detalle_compraService,
    private productoService: ProductoService,
  ) {
    this.filtroForm = this.fb.group({
      busqueda_categoria: [null],
      finicio: [null],
      fechaFin: [null],
    });
  }

  ngOnInit(): void {
    // Usamos forkJoin para esperar a que todas las llamadas HTTP terminen
    forkJoin([
      this.categoria_productoService.getAll(),
      this.productoService.getAll(),
      this.detalle_ventaService.getAll(),
      this.detalle_compraService.getAll()
    ]).subscribe({
      next: ([categorias, productos, ventas, compras]) => {
        this.categoria_productos = categorias;
        this.productos = productos;
        this.detalle_ventas = ventas;
        this.detalle_compras = compras;

        // Procesamos las categorías para el select
        this.selected_categoria = this.mapToSelectOptions(categorias, 'nombre');

        // Ahora que tenemos todos los datos, podemos cargar el kardex
        this.loadKardex();
      },
      error: (err) => {
        console.error('Error al cargar datos iniciales:', err);
      }
    });
  }

  private mapToSelectOptions(items: any[], labelField: string): { label: string; value: string }[] {
    return items.map(item => ({
      label: item[labelField],
      value: item._id
    }));
  }

  private findProduct(producto_id: string): Producto | undefined {
    return this.productos.find(p => p._id === producto_id);
  }

  loadKardex() {
    // Verificamos que tengamos los datos necesarios
    if (!this.productos.length || !this.detalle_ventas.length || !this.detalle_compras.length) {
      console.warn('Datos insuficientes para generar el kardex');
      return;
    }

    this.itemsEngresoVenta = this.detalle_ventas.map(d => {
      const producto = this.findProduct(d.producto_id)!;
      return {
        _id: d._id,
        orden: 0,
        producto: producto?.nombre,
        categoria_producto_id: producto?.categoria_producto_id,
        tamano: producto?.tamano,
        fecha: d.created_at,
        tipo: 'EGRESO',
        cantidad: d.cantidad,
        ope_monto: Number(d.cantidad) * Number(d.precio_venta)
      };
    });

    this.itemsIngresoCompra = this.detalle_compras.map(c => {
      const producto = this.findProduct(c.producto_id)!;
      return {
        _id: c._id,
        orden: 0,
        producto: producto?.nombre,
        categoria_producto_id: producto?.categoria_producto_id,
        tamano: producto?.tamano,
        fecha: c.created_at,
        tipo: 'INGRESO',
        cantidad: c.cantidad,
        ope_monto: Number(c.cantidad) * Number(c.precio_compra)
      };
    });

    this.itemsKardex = [...this.itemsIngresoCompra, ...this.itemsEngresoVenta];

    console.log('-------detalle_compras-------');
    console.log(this.detalle_compras);
    console.log('-------detalle_ventas-------');
    console.log(this.detalle_ventas);
    console.log('-------itemsIngresoCompra-------');
    console.log(this.itemsIngresoCompra);
    console.log('-------itemsEngresoVenta-------');
    console.log(this.itemsEngresoVenta);
  }

  formatDate(isoString: string): string {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  formatDatePicker(date: Date): string {
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  convertDateToISO(dateInput: string | Date): string {
    let day, month, year;

    if (dateInput instanceof Date) {
      day = dateInput.getDate();
      month = dateInput.getMonth() + 1;
      year = dateInput.getFullYear();
    } else {
      const parts = dateInput.split('/').map(Number);
      if (parts.length !== 3) throw new Error("Formato inválido. Use dd/mm/yyyy");
      [day, month, year] = parts;
    }

    const date = new Date(Date.UTC(year, month - 1, day, 5, 0, 0));
    return date.toISOString();
  }

  filtarCategoria($event: any) {
    const categoria_producto_id = $event.value;
    this.loadKardex();
    if (!categoria_producto_id) {
      this.loadKardex();
      return;
    }
    // Filtrar itemsPagos por el nombre del cliente
    this.itemsKardex = this.itemsKardex.filter(item => item.categoria_producto_id === categoria_producto_id);
  }
  filtarFecha($event: any, tipoFecha: number) {
    this.loadKardex();
    const fecha = this.formatDatePicker($event);
    const filtro = {
      inicio: tipoFecha === 1 ? fecha : '',
      fin: tipoFecha === 2 ? fecha : ''
    };
    if (!filtro.inicio && !filtro.fin) {
      return this.loadKardex();
    }
    this.itemsKardex = this.itemsKardex.filter(item => {
      let itemFecha = this.formatDate(item.fecha);
      console.log(itemFecha)
      return (!filtro.inicio || itemFecha>= filtro.inicio) &&
        (!filtro.fin || itemFecha <= filtro.fin);
    });

  }
}
