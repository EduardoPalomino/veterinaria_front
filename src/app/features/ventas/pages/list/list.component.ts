import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VentaService } from '../../services/venta.service';
import { Detalle_ventaService } from '../../../detalle_ventas/services/detalle_venta.service';
import { ClienteService } from '../../../clientes/services/cliente.service';
import { UsuarioService } from '../../../usuarios/services/usuario.service';
import { ProductoService } from '../../../productos/services/producto.service';
import { Venta } from '../../interfaces/venta.interface';
import { Detalle_venta } from '../../../detalle_ventas/interfaces/detalle_venta.interface';
import { Cliente } from '../../../clientes/interfaces/cliente.interface';
import { Usuario } from '../../../usuarios/interfaces/usuario.interface';
import { Producto } from '../../../productos/interfaces/producto.interface';
export interface venta_extendida extends Venta {
  cantidad:''
  precio:'',
  producto_id:'',
  venta_detalle_id:''
}
export interface venta_detalle extends Detalle_venta {}
export interface producto extends Producto {}
@Component({
  selector: 'app-venta-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class VentaListComponent implements OnInit {
  ventas: Venta[] = [];
  detalle_ventas: Detalle_venta[] = [];
  filteredVentas: Venta[] = [];
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  clientes: Cliente[]= [];
  usuarios: Usuario[]= [];
  productos: Producto[]= [];
  selected_cliente:{ label: string; value: string }[]=[];
  selected_usuario:{ label: string; value: string }[]=[];
  selected_producto:{ label: string; value: string }[]=[];
  ventaForm: FormGroup;
  mode:string='';
  venta: venta_extendida = {
    _id:'',
    fecha:'',
    venta_detalle_id:'',
    total:'',
    cantidad:'',
    producto_id:'',
    precio:'',
    cliente_id:'',
    usuario_id:'',
    created_at:'',
    updated_at:''
  };
  venta_detalle: venta_detalle = {
    _id: '',
    venta_id: '',
    producto_id: '',
    cantidad: '',
    precio_venta: '',
    created_at: '',
    updated_at: '',
  };
  producto: producto = {
    _id: '',
    nombre: '',
    categoria_producto_id: '',
    tamano: '',
    precio_venta: '',
    stock: '',
    descripcion: '',
    proveedor_id: '',
    created_at: '',
    updated_at: '',
  };
  constructor(
  private fb: FormBuilder,
  private ventaService: VentaService,
  private detalle_ventaService:Detalle_ventaService,
  private confirmationService: ConfirmationService,
  private messageService: MessageService,
  private clienteService:ClienteService,
  private usuarioService:UsuarioService,
  private productoService:ProductoService
  ) {
    this.ventaForm = this.fb.group({
      _id: [null],
      fecha: ['', Validators.required],
      venta_detalle_id: [''],
      cantidad: ['', Validators.required],
      precio: ['', Validators.required],
      total: ['', Validators.required],
      producto_id: ['', Validators.required],
      cliente_id: ['', Validators.required],
      usuario_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
     this.loadDetalle_ventas();
     this.loadClientes();
     this.loadUsuarios();
     this.loadProductos();
     this.loadVentas();
  }

  loadDetalle_ventas() {
    this.detalle_ventaService.getAll().subscribe({
      next: (data) => {
        this.detalle_ventas = data;
      },
      error: (err) => {
        console.error('Error al cargar Detalle_ventas:', err);
      }
    });
  }
  loadVentas() {
    this.ventaService.getAll().subscribe({
      next: (data) => {
        this.ventas = data.map(venta=>({
          ...venta,
          cantidad:this.detalle_ventas.find(detalle_venta=>detalle_venta.venta_id==venta._id)?.cantidad||'0',
          precio:this.detalle_ventas.find(detalle_venta=>detalle_venta.venta_id==venta._id)?.precio_venta||'0',
          producto_id:this.detalle_ventas.find(detalle_venta=>detalle_venta.venta_id==venta._id)?.producto_id||'',
          venta_detalle_id:this.detalle_ventas.find(detalle_venta=>detalle_venta.venta_id==venta._id)?._id||'0',
          cliente_nombre:this.clientes.find(cliente=>cliente._id==venta.cliente_id)?.nombres||'Sin Cliente',
          usuario_nombre:this.usuarios.find(usuario=>usuario._id==venta.usuario_id)?.nombre||'Sin Usuario'
        }));
        this.filteredVentas = [...this.ventas];
      },
      error: (err) => {
        console.error('Error al cargar Ventas:', err);
      }
    });
  }
  loadClientes() {
    this.clienteService.getAll().subscribe({
      next: (data) => {
        this.clientes = data;
        this.selected_cliente = this.clientes.map(cliente => ({
          label: cliente.nombres,
          value: cliente._id
        }));
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
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
  loadProductos() {
    this.productoService.getAll().subscribe({
      next: (data) => {
        this.productos = data;
        this.selected_producto = this.productos.map(producto => ({
          label: producto.descripcion,
          value: producto._id
        }));
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      }
    });
  }
  applyGlobalFilter() {
    const filterValue = this.globalFilter.toLowerCase().trim();
    console.log('Filtrando:', filterValue);

    if (!filterValue) {
      this.filteredVentas = [...this.ventas];
      return;
    }

    this.filteredVentas = this.ventas.filter((venta) =>
        Object.values(venta).some(
            (value) =>
                value &&
                value.toString().toLowerCase().includes(filterValue)
        )
    );
  }
  openModal(mode: 'Nuevo' | 'Editar', venta?: venta_extendida) {
    this.mode=mode;
    console.log(mode);
    this.modalTitle = `${mode} Venta`;
    this.modalVisible = true;

    if (mode === 'Editar' && venta) {
      console.log('---------------------------Edit Venta--------------------------');
      console.log('venta._id : '+venta._id);

      console.log(JSON.stringify(venta,null,2));
      const fecha = this.formatDate(venta.fecha);
      console.log('fechaaa : '+fecha);
      this.ventaForm.patchValue({
       _id: venta._id,
      fecha: fecha,
      venta_detalle_id: venta.venta_detalle_id,
      total: venta.total,
      cantidad: venta.cantidad,
      precio: venta.precio,
      producto_id: venta.producto_id,
      cliente_id: venta.cliente_id,
      usuario_id: venta.usuario_id
      });
    } else {
      this.ventaForm.reset();
    }
  }
  confirmarEliminacion(venta: Venta) {
    console.log("Clic en eliminar:", venta);
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el Venta: ${venta.fecha}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.deleteVenta(venta);
      }
    });
  }
  deleteVenta(venta: Venta) {
    this.ventaService.delete(venta._id).subscribe({
      next: () => {
        this.loadVentas();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Venta "${venta.fecha}" eliminado correctamente`
        });
      },
      error: (err) => {
        console.error('Error al eliminar el venta:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo eliminar el venta "${venta.fecha}"`
        });
      }
    });
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
        const stockNuevo:number = Number(stockExistente) - Number(cantidad);
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
  productoUpdateStock(producto_id: string, cantidad: string){
    this.calculateNewProductStock(producto_id, cantidad);
  }
  saveVentaDetalle(venta_detalle:venta_detalle){
    console.log('4-0 -----------------------------DENTRO DE --saveVentaDetalle --------------');
    console.log(JSON.stringify(venta_detalle,null,2));
    console.log('-------------------------------DETALLE DE VENTA ---------------------------');
    if (this.mode === 'Nuevo') {
      console.log('Test 2');
      this.detalle_ventaService.create(venta_detalle).subscribe({
        next: (response:any) => {
          this.productoUpdateStock(venta_detalle.producto_id,venta_detalle.cantidad);
          console.log('Test 3');
          console.log(JSON.stringify(response,null,2));
        },
        error: (err) => {
          console.error('Error al guardar el venta:', err);
        }
      });
    }else{

      console.log('5.0 UPDATE--Producto-----------------------');
      console.log('venta_detalle._id:'+venta_detalle._id);
      console.log('venta_detalle:'+JSON.stringify(venta_detalle));
      console.log('----------------------------------------------------------');
      this.detalle_ventaService.update(venta_detalle._id, venta_detalle).subscribe(() => {
        //this.mensajeConfirmacion(venta,"Registro Actualizado");
        this.productoUpdateStock(venta_detalle.producto_id,venta_detalle.cantidad);
      });
    }
  }
  saveVenta(data:any){
    console.log('1.- saveVenta : '+JSON.stringify(data));
    let venta ={
      _id:data._id,
      fecha:this.convertDateToISO(data.fecha),
      total:data.total,
      cliente_id:data.cliente_id,
      usuario_id:data.usuario_id,
      created_at:this.convertDateToISO(data.fecha),
      updated_at:this.convertDateToISO(data.fecha)
    };
    console.log('1.0.- saveVenta : '+JSON.stringify(venta));
    let venta_detalle  = {
      _id: '',
      venta_id: '',
      producto_id: data.producto_id,
      cantidad:data.cantidad,
      precio_venta:data.precio,
      created_at:this.convertDateToISO(data.fecha),
      updated_at:this.convertDateToISO(data.fecha),
    };
    let producto  = {
      _id: data.producto_id,
      nombre: data.producto_nombre,
      categoria_producto_id: data.producto_categoria,
      tamano: data.producto_tamano,
      precio_venta: data.precio,
      stock: data.stock,
      descripcion: data.producto_description,
      proveedor_id:data.proveedor_id,
      created_at: this.convertDateToISO(data.fecha),
      updated_at: this.convertDateToISO(data.fecha),
    };

    venta._id === null && delete venta._id;
    if (this.mode === 'Nuevo') {
        this.ventaService.create(venta).subscribe({
        next: (response:any) => {
          console.log('Venta guardado con éxito:', response);
          this.ventas.push(response); // Agregar el nuevo venta a la lista
          this.modalVisible = false; // Cerrar modal después de guardar
          console.log('---------------------------response------------------');
          console.log(JSON.stringify(response,null,2));
          venta_detalle.venta_id=response.data._id;
          this.saveVentaDetalle(venta_detalle);
          console.log('---------------------------Venta-Detalle------------------');
          console.log(JSON.stringify(venta_detalle,null,2));
          console.log('----------------------------------------------------------');

          this.loadVentas(); // Recargar lista de ventas
          this.mensajeConfirmacion(venta,"Registro Actualizado");
        },
        error: (err) => {
          console.error('Error al guardar el venta:', err);
        }
      });
    }else{
      console.log('2.- saveVenta Update: '+JSON.stringify(venta));
      console.log('saveVenta update venta._id: '+venta._id);
      console.log('saveVenta update: '+JSON.stringify(venta));
      venta_detalle._id=data.venta_detalle_id;
      venta_detalle.venta_id=data._id;
      this.ventaService.update(venta._id, venta).subscribe(() => {
        this.modalVisible = false;
        console.log('3.0 ----------------Update Venta-Detalle------------------');
        console.log(JSON.stringify(venta_detalle,null,2));
        console.log('----------------------------------------------------------');
        this.saveVentaDetalle(venta_detalle);
        this.loadVentas();
        this.mensajeConfirmacion(venta,"Registro Actualizado");
      });
    }
  }
  saveRegistro() {
    if (this.ventaForm.valid) { // Verifica que el formulario sea válido
      console.log('-A.-this.ventaForm-'+JSON.stringify(this.ventaForm.value));

      const data = this.ventaForm.value; // Obtener valores del formulario
      this.saveVenta(data);
      console.log('----B.-Enviamos data a this.saveVenta(data)---');
      console.log(JSON.stringify(data,null,2));
      console.log('----------------------------------------------------------');


      //console.log('Eduuuuu hola '+JSON.stringify(data));

    }
  }

  onChangeCliente(e: any) {
     this.ventaForm.patchValue({cliente_id:e.value});
  }
  onChangeUsuario(e: any) {
     this.ventaForm.patchValue({usuario_id:e.value});
  }
  onChangeProducto(e: any) {
    this.ventaForm.patchValue({producto_id:e.value});
  }
  mensajeConfirmacion(venta: Venta,mensaje:String){
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: ` Venta "${venta.fecha}" ${mensaje}`
    });
  }
  calcularTotal() {
    var total = this.ventaForm.value.cantidad*this.ventaForm.value.precio;
    this.ventaForm.patchValue({total:total});

    console.log("cantidad : "+this.ventaForm.value.cantidad);
    console.log("precio : "+this.ventaForm.value.precio);
    console.log("total : "+total);
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

}
