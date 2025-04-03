import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompraService } from '../../services/compra.service';
import { Detalle_compraService } from '../../../detalle_compras/services/detalle_compra.service';
import { ProveedorService } from '../../../proveedors/services/proveedor.service';
import { UsuarioService } from '../../../usuarios/services/usuario.service';
import { ProductoService } from '../../../productos/services/producto.service';
import { Compra } from '../../interfaces/compra.interface';
import { Detalle_compra } from '../../../detalle_compras/interfaces/detalle_compra.interface';
import { Proveedor } from '../../../proveedors/interfaces/proveedor.interface';
import { Usuario } from '../../../usuarios/interfaces/usuario.interface';
import {Producto} from "../../../productos/interfaces/producto.interface";
// Importaciones necesarias para .pipe():
import { lastValueFrom } from 'rxjs';


export interface CompraEntendida extends Compra {
  detalle_compra_id: string;
  compra_id: string;
  producto_id: string;
  cantidad: string;
  precio: string;
}
export interface ProductoResponse {
  producto: Producto;
  categoria_producto: any; // o define una interfaz adecuada
  proveedor: any;          // o define una interfaz adecuada
}
@Component({
  selector: 'app-compra-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})

export class CompraListComponent implements OnInit {
  _id_detalle_compra: string = '';
  compra_id: string = '';
  compras: CompraEntendida[] = [];
  detalle_compras: Detalle_compra[] = [];
  filteredCompras: CompraEntendida[] = [];
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  productos: Producto[]= [];
  proveedors: Proveedor[]= [];
  usuarios: Usuario[]= [];
  selected_proveedor:{ label: string; value: string }[]=[];
  selected_usuario:{ label: string; value: string }[]=[];
  selected_producto:{ label: string; value: string }[]=[];
  compraForm: FormGroup;
  mode:string='';
  producto: any = {
    _id: '',
    nombre: '',
    categoria_producto_id: '',
    tamano: '',
    precio_venta: '',
    stock: '',
    descripcion: '',
    proveedor_id: ''
  };

  constructor(
  private fb: FormBuilder,
  private compraService: CompraService,
  private confirmationService: ConfirmationService,
  private messageService: MessageService,
  private proveedorService:ProveedorService,
  private usuarioService:UsuarioService,
  private productoService:ProductoService,
  private detalle_compraService:Detalle_compraService
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
    const fechaActual = new Date();
    this.compraForm.patchValue({ fecha: fechaActual });
    setTimeout(() => {
      this.compraForm.controls['fecha'].setValue(fechaActual);
    });
    this.loadDetalle_compras();
    this.loadProductos();
    this.loadProveedors();
    this.loadUsuarios();
    this.loadCompras();
  }
  loadCompras() {
      this.compraService.getAll().subscribe({
        next: (data) => {
          this.compras = data.map(compra=>({
            ...compra,
            producto_id:this.detalle_compras.find(detalle_compra=>detalle_compra.compra_id==compra._id)?.producto_id||'Sin Producto',
            cantidad:this.detalle_compras.find(detalle_compra=>detalle_compra.compra_id==compra._id)?.cantidad||'Sin Cantidad',
            precio:this.detalle_compras.find(detalle_compra=>detalle_compra.compra_id==compra._id)?.precio_compra||'Sin Precio',
            detalle_compra_id:this.detalle_compras.find(detalle_compra=>detalle_compra.compra_id==compra._id)?._id||'Sin Detalle',
            compra_id:this.detalle_compras.find(detalle_compra=>detalle_compra.compra_id==compra._id)?.compra_id||'Sin Detalle',
            proveedor_nombre:this.proveedors.find(proveedor=>proveedor._id==compra.proveedor_id)?.nombre||'Sin Proveedor',
            usuario_nombre:this.usuarios.find(usuario=>usuario._id==compra.usuario_id)?.nombre||'Sin Usuario'
          }));
          this.filteredCompras = [...this.compras];
        },
        error: (err) => {
          console.error('Error al cargar Compras:', err);
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
  loadProductos() {
      this.productoService.getAll().subscribe({
        next: (data) => {
          this.productos = data;
          this.selected_producto = this.productos.map(producto => ({
            label: producto.nombre,
            value: producto._id
          }));
        },
        error: (err) => {
          console.error('Error al cargar productos:', err);
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
  loadUsuarios() {
    this.usuarioService.getAll().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.selected_usuario = this.usuarios.map(usuario => ({
          label: usuario.nombre,
          value: usuario._id
        }));
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
  }
  applyGlobalFilter() {
    const filterValue = this.globalFilter.toLowerCase().trim();
    console.log('Filtrando:', filterValue);

    if (!filterValue) {
      this.filteredCompras = [...this.compras];
      return;
    }

    this.filteredCompras = this.compras.filter((compra) =>
        Object.values(compra).some(
            (value) =>
                value &&
                value.toString().toLowerCase().includes(filterValue)
        )
    );
  }
  openModal(mode: 'Nuevo' | 'Editar', compra?: CompraEntendida) {
    this.mode=mode;
    console.log(mode);
    this.modalTitle = `${mode} Compra`;
    this.modalVisible = true;

    if (mode === 'Editar' && compra) {
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
    } else {
      this.compraForm.reset();
    }
  }
  formatDate(isoString: string): string {
    const date = new Date(isoString);

    let f= new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
    return f.toString();
  }
  convertDateToISO(dateInput: string | Date): string {
    let day, month, year;

    if (dateInput instanceof Date) {
      // Si es un Date, extrae día, mes y año
      day = dateInput.getDate();
      month = dateInput.getMonth() + 1;
      year = dateInput.getFullYear();
    } else {
      // Si es string, usa split (formato dd/mm/yyyy)
      const parts = dateInput.split('/').map(Number);
      if (parts.length !== 3) throw new Error("Formato inválido. Use dd/mm/yyyy");
      [day, month, year] = parts;
    }

    // Crea la fecha en UTC con 5:00 AM
    const date = new Date(Date.UTC(year, month - 1, day, 5, 0, 0));
    return date.toISOString();
  }
  confirmarEliminacion(compra: CompraEntendida) {
      console.log("Clic en eliminar:", compra);
      this.confirmationService.confirm({
        message: `¿Estás seguro de eliminar el Compra: ${compra.fecha}?`,
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        accept: () => {
          this.deleteCompra(compra);
        }
      });
    }
  deleteCompra(compra: CompraEntendida) {
      this.compraService.delete(compra._id).subscribe({
        next: () => {
          this.loadCompras();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `Compra "${compra.fecha}" eliminado correctamente`
          });
        },
        error: (err) => {
          console.error('Error al eliminar el compra:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `No se pudo eliminar el compra "${compra.fecha}"`
          });
        }
      });
    }
  saveCompra(registro:any){
    const compra: any = {
      _id: registro._id,
      fecha: this.convertDateToISO(registro.fecha),
      total: registro.total,
      proveedor_id: registro.proveedor_id,
      usuario_id: registro.usuario_id
    };
    const detalle_compra: any = {
      _id: null,
      compra_id: null,
      producto_id: registro.producto_id,
      cantidad: registro.cantidad,
      precio_compra: registro.precio,
    };

    compra._id === null && delete compra._id;
      if (this.mode === 'Nuevo') {
        this.compraService.create(compra).subscribe({
          next: (response:any) => {
            console.log('NUEVO data:', JSON.stringify(response.data,null,2));
            console.log('NUEVO data._id:', response.data._id);
            //this.compras.push(data);
            this.modalVisible = false;
            this.mensajeConfirmacion(compra,"Registro Actualizado");
            detalle_compra.compra_id=response.data._id;
            console.log('NUEVO detalle_compra:', JSON.stringify(detalle_compra,null,2));
            this.saveCompraDetalle(detalle_compra);
            this.loadCompras();
          },
          error: (err) => {
            console.error('Error al guardar el compra:', err);
          }
        });
      }else{
         // console.log("registro actualizar EDITAR: "+JSON.stringify(registro, null, 2));
          detalle_compra._id=registro.detalle_compra_id;
         // console.log('saveCompra COMPRA ID :'+registro._id);
          detalle_compra.compra_id=registro._id;

          this.compraService.update(compra._id, compra).subscribe(() => {
          this.saveCompraDetalle(detalle_compra);
          this.modalVisible = false;
          this.loadCompras();
          this.mensajeConfirmacion(compra,"Registro Actualizado");
        });

        console.log('saveCompra detalle_compra :'+JSON.stringify(detalle_compra, null, 2));

      }
  }
  saveCompraDetalle(detalle_compra:any){
    detalle_compra._id === null && delete detalle_compra._id;
    if (this.mode === 'Nuevo') {
      this.detalle_compraService.create(detalle_compra).subscribe({
        next: (data) => {
          this.productoUpdateStock(detalle_compra.producto_id,detalle_compra.cantidad);
          this.loadDetalle_compras();
          this.loadCompras();
          console.log('Detalle_compra guardado con éxito:', data);
        },
        error: (err) => {
          console.error('Error al guardar el detalle_compra:', err);
        }
      });
    }else{
      this.detalle_compraService.update(detalle_compra._id, detalle_compra).subscribe(() => {
        this.productoUpdateStock(detalle_compra.producto_id,detalle_compra.cantidad);
        this.loadDetalle_compras();
        this.loadCompras();
        //console.log('Datos actualizados:', JSON.stringify(detalle_compra));
      });
    }
  }
  saveRegistro() {
      if (this.compraForm.valid) { // Verifica que el formulario sea válido
        const compra = this.compraForm.value; // Obtener valores del formulario
        //console.log('saveRegistro:this._id_detalle_compra ', this._id_detalle_compra);

        this.saveCompra(compra);
      }
  }
  onChangeProducto(e: any) {
      this.compraForm.patchValue({producto_id:e.value});
  }
  onChangeProveedor(e: any) {
    this.compraForm.patchValue({proveedor_id:e.value});
  }
  onChangeUsuario(e: any) {
    this.compraForm.patchValue({usuario_id:e.value});
  }
  mensajeConfirmacion(compra: CompraEntendida,mensaje:String){
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: ` Compra "${compra.fecha}" ${mensaje}`
      });
  }
  calcularTotal() {
    var total = this.compraForm.value.cantidad*this.compraForm.value.precio;
    this.compraForm.patchValue({total:total});
    console.log("total : "+total);
  }
  calculateNewProductStock(producto_id:string,cantidad:string){
    let stockProducto ='';
    this.productoService.getById(producto_id).subscribe({
      next: (data:any) => {
        this.producto = data.producto;
        console.log('this.producto:', JSON.stringify(this.producto,null,2));
        console.log('producto Encontrado:', JSON.stringify(data.producto,null,2));
        const stockExistente:string = data.producto.stock;
        console.log('ANTES Stock Existente de : ', data.producto.nombre+' -> '+stockExistente);
        const stockNuevo:number = Number(stockExistente) + Number(cantidad);
        console.log('AHORA Stock Nuevo de : ', data.producto.nombre+' -> '+stockNuevo+'= cantidad : '+cantidad+' + stockExistente:'+stockExistente);
        stockProducto = stockNuevo.toString();
        this.producto.stock=stockProducto;
        this.actualizaStockProducto(this.producto);
      },
      error: (err) => {
        console.error('Error de producto Encontrado:', err);
       return stockProducto=err;
      }
    });
  }
  actualizaStockProducto(producto:Producto){

    this.productoService.update(producto._id,producto).subscribe({
      next: (data:any) => {
        console.log('Stock de producto:'+data.nombre+' Nuevo Stock es:'+data.stock);
      },
      error: (err) => {
        console.error('Error de producto Encontrado:', err);
      }
    });
  }
   productoUpdateStock(producto_id: string, cantidad: string) {
     this.calculateNewProductStock(producto_id, cantidad);
  }

}
