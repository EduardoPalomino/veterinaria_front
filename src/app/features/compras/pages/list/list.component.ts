import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';

// Services
import { CompraService } from '../../services/compra.service';
import { Detalle_compraService } from '../../../detalle_compras/services/detalle_compra.service';
import { ProveedorService } from '../../../proveedors/services/proveedor.service';
import { UsuarioService } from '../../../usuarios/services/usuario.service';
import { ProductoService } from '../../../productos/services/producto.service';

// Interfaces
import { Compra } from '../../interfaces/compra.interface';
import { Detalle_compra } from '../../../detalle_compras/interfaces/detalle_compra.interface';
import { Proveedor } from '../../../proveedors/interfaces/proveedor.interface';
import { Usuario } from '../../../usuarios/interfaces/usuario.interface';
import { Producto } from "../../../productos/interfaces/producto.interface";

export interface CompraEntendida extends Compra {
  detalle_compra_id: string;
  compra_id: string;
  producto_id: string;
  cantidad: string;
  precio: string;
  proveedor_nombre: string;
  usuario_nombre: string;
}

interface HistorialCompra {
  proveedor: string;
  producto: string;
  descripcion: string;
  tamano: string;
  cantidad: string;
  precio: string;
  compra_total: string;
}

interface itemsCompra {
  _id: string;
  usuario_id: string;
  proveedor_id: string;
  proveedor: string;
  producto_id: string;
  nombre: string;
  descripcion: string;
  tamano: string;
  stock: string;
  precio_compra: string;
  subtotal: string;
}

@Component({
  selector: 'app-compra-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class CompraListComponent implements OnInit {
  compras: CompraEntendida[] = [];
  detalle_compras: Detalle_compra[] = [];
  filteredCompras: CompraEntendida[] = [];
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  productos: Producto[] = [];
  proveedors: Proveedor[] = [];
  usuarios: Usuario[] = [];
  itemsCompra: itemsCompra[] = [];
  historial_compras: HistorialCompra[] = [];

  selected_proveedor: { label: string; value: string }[] = [];
  selected_usuario: { label: string; value: string }[] = [];
  selected_producto: { label: string; value: string }[] = [];
  selected_checkbox_producto: any[] = [];

  compraForm: FormGroup;
  mode: string = '';
  compraNuevaMonto: number = 0;

  proveedor_asignado: string = 'Sin asignar';
  proveedor_asignadoId: string = '';
  fechaActual = new Date();
  usuario_id: string = '67cd3ffb2b98c15b3b2e9ba2';
  proveedor_id: string = '';

  // Variables para el escáner de código de barras
  barcodeTimeout: any;
  lastScannedValue: string = '';
  barcodeDebounceTime: number = 300; // Tiempo en milisegundos para el debounce

  constructor(
    private fb: FormBuilder,
    private compraService: CompraService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private proveedorService: ProveedorService,
    private usuarioService: UsuarioService,
    private productoService: ProductoService,
    private detalle_compraService: Detalle_compraService
  ) {
    this.compraForm = this.fb.group({
      _id: [null],
      fecha: [new Date(), Validators.required],
      detalle_compra_id: [''],
      cantidad: ['', Validators.required],
      precio: ['', Validators.required],
      total: ['', Validators.required],
      producto_id: ['', Validators.required],
      proveedor_id: ['', Validators.required],
      usuario_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.initializeFormWithCurrentDate();
    this.loadInitialData();
  }

  private initializeFormWithCurrentDate(): void {
    const fechaActual = new Date();
    this.compraForm.patchValue({ fecha: fechaActual });
    setTimeout(() => {
      this.compraForm.controls['fecha'].setValue(fechaActual);
    });
  }

  private loadInitialData(): void {
    this.loadDetalle_compras();
    this.loadProductos();
    this.loadProveedors();
    this.loadUsuarios();
    this.loadCompras();
  }

  // Métodos de carga de datos
  loadCompras(): void {
    this.compraService.getAll().subscribe({
      next: (data) => {
        this.compras = this.extendCompraData(data);
        this.historial_compras = data.map(compra => this.createHistorialVenta(compra));
        this.filteredCompras = [...this.compras];
      },
      error: (err) => console.error('Error al cargar Compras:', err)
    });
  }

  private extendCompraData(compras: Compra[]): CompraEntendida[] {
    return compras.map(compra => ({
      ...compra,
      producto_id: this.findDetalleCompra(compra._id)?.producto_id || 'Sin Producto',
      cantidad: this.findDetalleCompra(compra._id)?.cantidad || 'Sin Cantidad',
      precio: this.findDetalleCompra(compra._id)?.precio_compra || 'Sin Precio',
      detalle_compra_id: this.findDetalleCompra(compra._id)?._id || 'Sin Detalle',
      compra_id: this.findDetalleCompra(compra._id)?.compra_id || 'Sin Detalle',
      proveedor_nombre: this.findProveedorName(compra.proveedor_id),
      usuario_nombre: this.findUsuarioName(compra.usuario_id)
    }));
  }

  private createHistorialVenta(compra: Compra): HistorialCompra {
    let detalle = this.findDetalleCompra(compra._id);
    let producto = detalle ? this.findProduct(detalle.producto_id) : null;
    let compra_total = this.calculateCompraTotal(detalle);
    let proveedor = this.findProveedor(compra.proveedor_id);

    return {
      proveedor: proveedor?.nombre || '',
      producto: producto?.nombre || '',
      descripcion: producto?.descripcion || '',
      tamano: producto?.tamano || '',
      cantidad: detalle?.cantidad || '0',
      precio: detalle?.precio_compra || '0',
      compra_total: compra_total.toString()
    };
  }

  private findDetalleCompra(compraId: string): Detalle_compra | undefined {
    return this.detalle_compras.find(d => d.compra_id === compraId);
  }

  private findProveedorName(proveedorId: string): string {
    return this.proveedors.find(p => p._id === proveedorId)?.nombre || 'Sin Proveedor';
  }

  private findUsuarioName(usuarioId: string): string {
    return this.usuarios.find(u => u._id === usuarioId)?.nombre || 'Sin Usuario';
  }

  private findProduct(producto_id: string): Producto | undefined {
    return this.productos.find(p => p._id === producto_id);
  }

  private calculateCompraTotal(detalle?: Detalle_compra): number {
    if (!detalle) return 0;
    return Number(detalle.cantidad || 0) * Number(detalle.precio_compra || 0);
  }

  private findProveedor(proveedor_id: string): Proveedor | undefined {
    return this.proveedors.find(p => p._id === proveedor_id);
  }

  loadDetalle_compras(): void {
    this.detalle_compraService.getAll().subscribe({
      next: (data) => this.detalle_compras = data,
      error: (err) => console.error('Error al cargar Detalle_compras:', err)
    });
  }

  loadProductos(): void {
    console.log('Cargando productos...');
    this.productoService.getAll().subscribe({
      next: (data) => {
        this.productos = data;
        this.selected_producto = this.mapToSelectOptions(data, 'nombre');
        console.log('Productos cargados:', this.productos);
      },
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  loadProveedors(): void {
    this.proveedorService.getAll().subscribe({
      next: (data) => {
        this.proveedors = data;
        this.selected_proveedor = this.mapToSelectOptions(data, 'nombre');
      },
      error: (err) => console.error('Error al cargar proveedores:', err)
    });
  }

  loadUsuarios(): void {
    this.usuarioService.getAll().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.selected_usuario = this.mapToSelectOptions(data, 'nombre');
      },
      error: (err) => console.error('Error al cargar usuarios:', err)
    });
  }

  private mapToSelectOptions(items: any[], labelField: string): { label: string; value: string }[] {
    return items.map(item => ({
      label: item[labelField],
      value: item._id
    }));
  }

  // Métodos de UI
  applyGlobalFilter(): void {
    const filterValue = this.globalFilter.toLowerCase().trim();

    if (!filterValue) {
      this.filteredCompras = [...this.compras];
      return;
    }

    this.filteredCompras = this.compras.filter(compra =>
      Object.values(compra).some(
        value => value && value.toString().toLowerCase().includes(filterValue)
      ));
  }

  openModal(mode: 'Nuevo' | 'Editar', compra?: CompraEntendida): void {
    this.mode = mode;
    this.modalTitle = `${mode} Compra`;
    this.modalVisible = true;

    if (mode === 'Editar' && compra) {
      this.patchFormForEdit(compra);
    } else {
      this.compraForm.reset();
      this.compraForm.patchValue({ fecha: new Date() });
    }
  }

  private patchFormForEdit(compra: CompraEntendida): void {
    const fecha = this.formatDate(compra.fecha);
    this.compraForm.patchValue({
      _id: compra._id,
      fecha: fecha,
      detalle_compra_id: compra.detalle_compra_id,
      total: compra.total,
      producto_id: compra.producto_id,
      cantidad: compra.cantidad,
      precio: compra.precio,
      proveedor_id: compra.proveedor_id,
      usuario_id: compra.usuario_id
    });
  }

  confirmarEliminacion(compra: CompraEntendida): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar la Compra: ${compra.fecha}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => this.deleteCompra(compra)
    });
  }

  // Métodos CRUD
  deleteCompra(compra: CompraEntendida): void {
    this.compraService.delete(compra._id).subscribe({
      next: () => {
        this.loadCompras();
        this.showMessage('success', 'Éxito', `Compra "${compra.fecha}" eliminada correctamente`);
      },
      error: (err) => {
        console.error('Error al eliminar la compra:', err);
        this.showMessage('error', 'Error', `No se pudo eliminar la compra "${compra.fecha}"`);
      }
    });
  }

  saveRegistro(): void {
    if (this.compraForm.valid) {
      const compra = this.compraForm.value;
      this.saveCompra(compra);
    }
  }

  saveCompra(registro: any): void {
    const compra = this.prepareCompraData(registro);
    const detalle_compra = this.prepareDetalleCompraData(registro);

    if (this.mode === 'Nuevo') {
      this.createNewCompra(compra, detalle_compra);
    } else {
      this.updateExistingCompra(compra, detalle_compra);
    }
  }

  private prepareCompraData(registro: any): any {
    return {
      _id: registro._id,
      fecha: this.convertDateToISO(registro.fecha),
      total: registro.total,
      proveedor_id: registro.proveedor_id,
      usuario_id: registro.usuario_id
    };
  }

  private prepareDetalleCompraData(registro: any): any {
    return {
      _id: this.mode === 'Editar' ? registro.detalle_compra_id : null,
      compra_id: registro._id,
      producto_id: registro.producto_id,
      cantidad: registro.cantidad,
      precio_compra: registro.precio
    };
  }

  private createNewCompra(compra: any, detalle_compra: any): void {
    this.compraService.create(compra).subscribe({
      next: (response: any) => {
        detalle_compra.compra_id = response.data._id;
        this.saveCompraDetalle(detalle_compra);
        this.modalVisible = false;
        this.showMessage('success', 'Éxito', 'Compra creada correctamente');
        this.loadCompras();
      },
      error: (err) => console.error('Error al guardar la compra:', err)
    });
  }

  private updateExistingCompra(compra: any, detalle_compra: any): void {
    this.compraService.update(compra._id, compra).subscribe({
      next: () => {
        this.saveCompraDetalle(detalle_compra);
        this.modalVisible = false;
        this.showMessage('success', 'Éxito', 'Compra actualizada correctamente');
        this.loadCompras();
      },
      error: (err) => console.error('Error al actualizar la compra:', err)
    });
  }

  saveCompraDetalle(detalle_compra: any): void {
    if (this.mode === 'Nuevo') {
      this.detalle_compraService.create(detalle_compra).subscribe({
        next: () => {
          this.productoUpdateStock(detalle_compra.producto_id, detalle_compra.cantidad);
          this.loadDetalle_compras();
          this.loadCompras();
        },
        error: (err) => console.error('Error al guardar el detalle_compra:', err)
      });
    } else {
      this.detalle_compraService.update(detalle_compra._id, detalle_compra).subscribe({
        next: () => {
          this.productoUpdateStock(detalle_compra.producto_id, detalle_compra.cantidad);
          this.loadDetalle_compras();
          this.loadCompras();
        },
        error: (err) => console.error('Error al actualizar el detalle_compra:', err)
      });
    }
  }

  // Métodos de utilidad
  formatDate(isoString: string): string {
    const date = new Date(isoString);
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

  formatDatePicker(date: Date): string {
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  // Métodos de manejo de productos
  calculateNewProductStock(producto_id: string, cantidad: string): void {
    this.productoService.getById(producto_id).subscribe({
      next: (data: any) => {
        const producto = data.producto;
        const stockExistente = data.producto.stock;
        const stockNuevo = Number(stockExistente) + Number(cantidad);

        producto.stock = stockNuevo.toString();
        this.actualizaStockProducto(producto);
      },
      error: (err) => console.error('Error al obtener producto:', err)
    });
  }

  actualizaStockProducto(producto: Producto): void {
    this.productoService.update(producto._id, producto).subscribe({
      next: (data: any) => {
        console.log(`Stock actualizado: ${data.nombre} -> ${data.stock}`);
      },
      error: (err) => console.error('Error al actualizar producto:', err)
    });
  }

  productoUpdateStock(producto_id: string, cantidad: string): void {
    this.calculateNewProductStock(producto_id, cantidad);
  }

  // Métodos de eventos
  onChangeProducto(e: any): void {
    this.compraForm.patchValue({ producto_id: e.value });
  }

  onChangeProveedor(e: any): void {
    this.compraForm.patchValue({ proveedor_id: e.value });
  }

  onChangeUsuario(e: any): void {
    this.compraForm.patchValue({ usuario_id: e.value });
  }

  calcularTotal(): void {
    const total = this.compraForm.value.cantidad * this.compraForm.value.precio;
    this.compraForm.patchValue({ total: total });
  }

  // Métodos de mensajería
  private showMessage(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail });
  }

  onAddProveedorToBuy($event: any) {
    let proveedor = $event.value;
    this.proveedor_asignado = proveedor.label;
    this.proveedor_asignadoId = proveedor.value;

    this.proveedor_id = this.proveedors.find(m => m._id === this.proveedor_asignadoId)?._id || '';
    this.itemsCompra = this.itemsCompra.map(item => ({
      ...item,
      proveedor: this.proveedor_asignado,
      proveedor_id: this.proveedor_id
    }));
  }

  realizarCompra() {
    this.mode = 'Nuevo';
    const fecha = this.formatDatePicker(this.fechaActual);

    this.itemsCompra.forEach(item => {
      const compraData = {
        _id: null,
        fecha: fecha,
        total: item.subtotal,
        proveedor_id: this.proveedor_id,
        usuario_id: this.usuario_id,
        producto_id: item.producto_id,
        cantidad: item.stock,
        precio: item.precio_compra
      };

      this.saveCompra(compraData);
    });

    // Limpiar la lista después de realizar la compra
    this.itemsCompra = [];
    this.compraNuevaMonto = 0;
  }

  onCheckboxTogglex(): void {
    let montos: number[] = this.selected_checkbox_producto.map(item => {
      return parseInt(item.precio_compra) * parseInt(item.stock);
    });
    this.compraNuevaMonto = montos.reduce((total, monto) => total + monto, 0);
  }

  searchProduct($event: any): void {
    let productoId = $event.value;
    this.onAddProductToBuy(productoId);
  }

  onAddProductToBuy(productoId: any): void {
    const productoSeleccionado = this.productos.find(p => p._id === productoId);
    if (!productoSeleccionado) {
      console.warn('Producto no encontrado');
      return;
    }

    const itemExistenteIndex = this.itemsCompra.findIndex(item => item._id === productoId);

    if (itemExistenteIndex >= 0) {
      this.itemsCompra[itemExistenteIndex].stock = String(Number(this.itemsCompra[itemExistenteIndex].stock) + 1);
      this.itemsCompra[itemExistenteIndex].subtotal = String(
        Number(this.itemsCompra[itemExistenteIndex].precio_compra) *
        Number(this.itemsCompra[itemExistenteIndex].stock)
      );
    } else {
      this.itemsCompra.push({
        _id: productoSeleccionado._id,
        usuario_id: this.usuario_id,
        proveedor_id: this.proveedor_id,
        proveedor: this.proveedor_asignado,
        producto_id: productoId,
        nombre: productoSeleccionado.nombre,
        descripcion: productoSeleccionado.descripcion,
        precio_compra: productoSeleccionado.precio_venta,
        tamano: productoSeleccionado.tamano,
        stock: '1',
        subtotal: productoSeleccionado.precio_venta
      });
    }

    this.calcularTotalCompra();
  }

  onUpdateProductToBuyQuantity(p: itemsCompra, i: number) {
    this.itemsCompra[i].stock = p.stock;
    this.itemsCompra[i].subtotal = String(
      Number(this.itemsCompra[i].precio_compra) *
      Number(this.itemsCompra[i].stock)
    );
    this.calcularTotalCompra();
  }

  onUpdateProductToBuyPrice(p: itemsCompra, i: number) {
    this.itemsCompra[i].precio_compra = p.precio_compra;
    this.itemsCompra[i].subtotal = String(
      Number(this.itemsCompra[i].precio_compra) *
      Number(this.itemsCompra[i].stock)
    );
    this.calcularTotalCompra();
  }

  private calcularTotalCompra(): void {
    this.compraNuevaMonto = this.itemsCompra.reduce((total, item) => {
      return total + (Number(item.precio_compra) * Number(item.stock));
    }, 0);
  }

  // Métodos para el escáner de código de barras
// Métodos para el escáner de código de barras
  onBarcodeInput(event: Event): void {
    clearTimeout(this.barcodeTimeout);
    const input = event.target as HTMLInputElement;
    this.lastScannedValue = input.value;

    this.barcodeTimeout = setTimeout(() => {
      if (this.lastScannedValue && this.lastScannedValue.length > 0) {
        this.searchProductBarcode(this.lastScannedValue);
        input.value = '';
      }
    }, this.barcodeDebounceTime);
  }

  searchProductBarcode(codigo_barras: any): void {
    console.log('Buscando producto con código de barras:', codigo_barras);

    const producto = this.productos.find(p =>
      p.codigo_barras?.toString().trim() === codigo_barras.toString().trim()
    );

    if (producto) {
      console.log('Producto encontrado:', producto);
      this.onAddProductToBuy(producto._id);
    } else {
      console.warn('Producto no encontrado con código:', codigo_barras);
      this.showMessage('warn', 'Producto no encontrado', `No se encontró un producto con código ${codigo_barras}`);
    }
  }



}
