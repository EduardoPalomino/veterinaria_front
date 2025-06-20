import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { Categoria_productoService } from '../../../categoria_productos/services/categoria_producto.service';
import { ProveedorService } from '../../../proveedors/services/proveedor.service';
import { Detalle_compraService } from '../../../detalle_compras/services/detalle_compra.service';
import { Producto } from '../../interfaces/producto.interface';
import { Categoria_producto } from '../../../categoria_productos/interfaces/categoria_producto.interface';
import { Proveedor } from '../../../proveedors/interfaces/proveedor.interface';
import { Detalle_compra } from '../../../detalle_compras/interfaces/detalle_compra.interface';

import { HttpClient } from '@angular/common/http';
import {environment} from "../../../../../environments/environment";



@Component({
  selector: 'app-producto-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class ProductoListComponent implements OnInit {
  // Propiedades del componente
  productos: Producto[] = [];
  detalle_compras: Detalle_compra[] = [];
  producto: Producto={
    _id: '',
    nombre: '',
    foto: '',
    codigo_barras:'',
    categoria_producto_id: '',
    tamano: '',
    precio_venta: '',
    stock: '',
    descripcion: '',
    proveedor_id: '',
    created_at: '',
    updated_at: ''
  };
  filteredProductos: Producto[] = [];
  filteredProducts: Producto[] = [];
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  mode: string = '';

  categoria_productos: Categoria_producto[] = [];
  proveedors: Proveedor[] = [];

  selected_categoria_producto: { label: string; value: string }[] = [];
  selected_proveedor: { label: string; value: string }[] = [];
  selected_producto: { label: string; value: string }[] = [];

  productoForm: FormGroup;
  //Grid
  productoGrid: any = {
    _id:'',
    nombre: '',
    foto: '',
    categoria: '',
    tamano: '',
    precio_venta: '',
    stock: ''
  };
  productoInventario: any = {
    _id:'',
    fecha: '',
    unidades: ''
  };
  uploadedFile: File | null = null;
  previewImage: string | ArrayBuffer | null = null;
  apiUrl = `${environment.API_URL}`;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private productoService: ProductoService,
    private detalle_compraService: Detalle_compraService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private categoria_productoService: Categoria_productoService,
    private proveedorService: ProveedorService
  ) {
    this.productoForm = this.fb.group({
      _id: [null],
      nombre: ['', Validators.required],
      foto: [''],
      codigo_barras: [''],
      categoria_producto_id: ['', Validators.required],
      tamano: ['', Validators.required],
      precio_venta: ['', Validators.required],
      stock: ['', Validators.required],
      descripcion: ['', Validators.required],
      proveedor_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategoria_productos();
    this.loadProveedors();
    this.loadProductos();
    this.loadDetalle_compras()
  }

  // Métodos de carga de datos
  loadProductos() {
    this.productoService.getAll().subscribe({
      next: (data) => {
        this.productos = data.map(producto => ({
          ...producto,
          categoria_producto_nombre: this.categoria_productos.find(categoria_producto => categoria_producto._id == producto.categoria_producto_id)?.descripcion || 'Sin Categoria_producto',
          proveedor_nombre: this.proveedors.find(proveedor => proveedor._id == producto.proveedor_id)?.nombre || 'Sin Proveedor'
        }));
        this.filteredProductos = [...this.productos];

        this.selected_producto = data.map(p => ({
          label: p.nombre,
          value: p._id
        }));

      },
      error: (err) => {
        console.error('Error al cargar Productos:', err);
      }
    });
  }

  loadDetalle_compras() {
    this.detalle_compraService.getAll().subscribe({
      next: (data) => {
        this.detalle_compras = data;
      },
      error: (err) => {
        console.error('Error al cargar Detalle_compras:', err);
      }
    });
  }
  formatDate(isoString: string | null | undefined): string {
    // Si no hay fecha (null, undefined o string vacío), usa la fecha actual
    const date = isoString ? new Date(isoString) : new Date();

    // Si la fecha es inválida (NaN), usa la fecha actual
    if (isNaN(date.getTime())) {
      return new Intl.DateTimeFormat('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(new Date()); // Fecha actual en formato peruano
    }

    // Formatea la fecha correctamente
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }
  loadCategoria_productos() {
    this.categoria_productoService.getAll().subscribe({
      next: (data) => {
        this.categoria_productos = data;
        this.selected_categoria_producto = this.categoria_productos.map(categoria_producto => ({
          label: categoria_producto.descripcion,
          value: categoria_producto._id
        }));
      },
      error: (err) => {
        console.error('Error al cargar categoria_productos:', err);
      }
    });
  }
  loadProveedors() {
    this.proveedorService.getAll().subscribe({
      next: (data) => {
        this.proveedors = data;
        this.selected_proveedor = this.proveedors.map(proveedor => ({
          label: proveedor.nombre,
          value: proveedor._id
        }));
      },
      error: (err) => {
        console.error('Error al cargar proveedors:', err);
      }
    });
  }
  //change
  onAddProductoTGrid($event:any){
    let producto_id= $event.value.value;
    this.producto = this.findProducto(producto_id);
    let productoCategoria = this.findCategoria(this.producto.categoria_producto_id);
    this.productoGrid={
        _id:this.producto._id,
        nombre: this.producto.nombre,
        foto: this.producto.foto,
        categoria: productoCategoria.nombre,
        tamano: this.producto.tamano,
        precio: this.producto.precio_venta,
        stock: this.producto.stock
    };
    console.log(producto_id)
    console.log(JSON.stringify(this.productoGrid))

    //this.productoInventario =findDetalle_compra

    this.productoInventario = this.detalle_compras
      .filter(d => d.producto_id === producto_id)
      .map(d => ({
        _id:d._id,
        fecha: this.formatDate(d.created_at),
        unidades: d.cantidad,
      }));


  }
  //find
  private findProducto(producto_id: string): any{
    return this.productos.find(p => p._id === producto_id);
  }
  private findCategoria(categoria_id: string): any{
    return this.categoria_productos.find(c => c._id === categoria_id);
  }
  private findDetalle_compra(producto_id: string): any{
    return this.detalle_compras.find(c => c.producto_id === producto_id);
  }
  // Métodos de filtrado
  applyGlobalFilter() {
    const filterValue = this.globalFilter.toLowerCase().trim();
    console.log('Filtrando:', filterValue);

    if (!filterValue) {
      this.filteredProductos = [...this.productos];
      return;
    }

    this.filteredProductos = this.productos.filter((producto) =>
      Object.values(producto).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(filterValue)
      )
    );
  }

  filterProducts(event: any) {
    const query = event.query.toLowerCase();
    this.filteredProducts = this.productos.filter(producto =>
      producto.nombre.toLowerCase().includes(query) ||
      producto.descripcion.toLowerCase().includes(query)
    );
  }

  // Métodos del modal y formulario
  openModal(mode: 'Nuevo' | 'Editar', producto?: Producto) {
    this.mode = mode;
    console.log(mode);
    this.modalTitle = `${mode} Producto`;
    this.modalVisible = true;

    if (mode === 'Editar' && producto) {
      this.productoForm.patchValue({
        _id: producto._id,
        nombre: producto.nombre,
        foto: producto.foto,
        codigo_barras: producto.codigo_barras,
        categoria_producto_id: producto.categoria_producto_id,
        tamano: producto.tamano,
        precio_venta: producto.precio_venta,
        stock: producto.stock,
        descripcion: producto.descripcion,
        proveedor_id: producto.proveedor_id
      });
    } else {
      this.productoForm.reset();
    }
  }

  saveRegistro() {
    if (this.productoForm.valid) {
      const producto = this.productoForm.value;

      // Verificar si hay una imagen para subir
      if (this.uploadedFile && !producto.foto) {
        // Primero subir la imagen, luego guardar el producto
        this.uploadFile().then((imageUrl: string) => {
          producto.foto = imageUrl;
          this.saveProductData(producto);
        }).catch(error => {
          console.error('Error al subir la imagen:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al subir la imagen del producto'
          });
        });
      } else {
        // No hay imagen nueva que subir, guardar directamente
        this.saveProductData(producto);
      }
    }
  }

  private async  saveProductData(producto: any) {
    // Limpiar el ID si es nuevo registro
    producto._id === null && delete producto._id;

    // Si hay una imagen para subir, procesarla primero
    // Si hay una imagen para subir, procesarla primero
    if (this.uploadedFile) {
      const imageUrl = await this.uploadFile();
      producto.foto = imageUrl;
    }

    const saveObservable = this.mode === 'Nuevo'
      ? this.productoService.create(producto)
      : this.productoService.update(producto._id, producto);

    saveObservable.subscribe({
      next: (data) => {
        console.log('Producto guardado con éxito:', data);
        this.modalVisible = false;
        this.loadProductos();
        this.mensajeConfirmacion(producto, "Registro Actualizado");

        // Resetear el estado de la imagen
        this.uploadedFile = null;
        this.previewImage = null;
      },
      error: (err) => {
        console.error('Error al guardar el producto:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al guardar el producto'
        });
      }
    });
  }

  // Métodos de selección
  onChangeCategoria_producto(e: any) {
    this.productoForm.patchValue({ categoria_producto_id: e.value });
  }

  onChangeProveedor(e: any) {
    this.productoForm.patchValue({ proveedor_id: e.value });
  }
  // Métodos de eliminación
  confirmarEliminacion(producto: Producto) {
    console.log("Clic en eliminar:", producto);
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el Producto: ${producto.nombre}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.deleteProducto(producto);
      }
    });
  }

  deleteProducto(producto: Producto) {
    this.productoService.delete(producto._id).subscribe({
      next: () => {
        this.loadProductos();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Producto "${producto.nombre}" eliminado correctamente`
        });
      },
      error: (err) => {
        console.error('Error al eliminar el producto:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo eliminar el producto "${producto.nombre}"`
        });
      }
    });
  }

  // Métodos auxiliares
  mensajeConfirmacion(producto: Producto, mensaje: String) {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: ` Producto "${producto.nombre}" ${mensaje}`
    });
  }

  onFileSelect(event: any) {
    const file = event.files?.[0] || event.target?.files?.[0];
    if (file) {
      this.uploadedFile = file;

      // Mostrar previsualización
      const reader = new FileReader();
      reader.onload = (e) => this.previewImage = e.target?.result || null;
      reader.readAsDataURL(file);
    }
  }
  // Modificamos uploadFile para que devuelva una Promise
  private async  uploadFile(): Promise<string>  {
    return new Promise((resolve, reject) => {
      if (!this.uploadedFile) {
        reject('No hay archivo para subir');
        return;
      }

      const formData = new FormData();
      formData.append('file', this.uploadedFile);

      this.http.post(`${this.apiUrl}upload`, formData).subscribe({
        next: (res: any) => {
          resolve(res.url); // Resuelve con la URL de la imagen
        },
        error: (err) => {
          reject(err);
        }
      });
    });
  }

}
