import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VentaService } from '../../services/venta.service';
import { Detalle_ventaService } from '../../../detalle_ventas/services/detalle_venta.service';
import { ClienteService } from '../../../clientes/services/cliente.service';
import { UsuarioService } from '../../../usuarios/services/usuario.service';
import { ProductoService } from '../../../productos/services/producto.service';
import { Categoria_productoService } from '../../../categoria_productos/services/categoria_producto.service';
import { MascotaService } from '../../../mascotas/services/mascota.service';
import { PagoService } from '../../../pagos/services/pago.service';
import { Venta } from '../../interfaces/venta.interface';
import { Detalle_venta } from '../../../detalle_ventas/interfaces/detalle_venta.interface';
import { Cliente } from '../../../clientes/interfaces/cliente.interface';
import { Usuario } from '../../../usuarios/interfaces/usuario.interface';
import { Producto } from '../../../productos/interfaces/producto.interface';
import { Categoria_producto } from '../../../categoria_productos/interfaces/categoria_producto.interface';
import { Mascota } from '../../../mascotas/interfaces/mascota.interface';
import { Pago } from '../../../pagos/interfaces/pago.interface';
import {Historia_clinica} from "../../../historia_clinicas/interfaces/historia_clinica.interface";

interface VentaExtendida extends Venta {
  cantidad: string;
  precio: string;
  producto_id: string;
  venta_detalle_id: string;
  cliente_nombre: string;
  usuario_nombre: string;
}

interface HistorialVenta {
  cliente: string;
  producto: string;
  descripcion: string;
  tamano: string;
  cantidad: string;
  precio: string;
  venta_total: string;
}
interface itemsVenta {
  _id:string;
  usuario_id:string;
  cliente_id:string;
  tipo_pago: string,
  cantidad_cuota:  number,
  estado:  string,
  mascota: string;
  producto_id:string;
  nombre: string;
  descripcion: string;
  tamano: string;
  stock: string;
  precio_venta: string;
  subtotal: string;
}
type pago = Omit<Pago, '_id'|'created_at'|'updated_at'>
@Component({
  selector: 'app-venta-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class VentaListComponent implements OnInit {
  ventas: VentaExtendida[] = [];
  detalle_ventas: Detalle_venta[] = [];
  filteredVentas: Producto[] = [];
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  modalPagoVisible: boolean = false;
  modalPagoTitle: string = '';
  clientes: Cliente[] = [];
  usuarios: Usuario[] = [];
  productos: Producto[] = [];
  historial_ventas: HistorialVenta[] = [];
  categoria_productos: Categoria_producto[] = [];
  mascotas: Mascota[] = [];
  itemsVenta:itemsVenta[]=[];

  selected_cliente: { label: string; value: string }[] = [];
  selected_usuario: { label: string; value: string }[] = [];
  selected_producto: { label: string; value: string }[] = [];
  selected_mascota: { label: string; value: string }[] = [];
  selected_categoria_producto: { label: string; value: string }[] = [];
  selected_checkbox_producto: Producto[] = [];
  selected_tipo_pago : { label: string; value: string }[]=[
    {label:'Efectivo',value:'1'},
    {label:'Tarjeta Débito',value:'2'},
    {label:'Tarjeta Crédito',value:'3'},
    {label:'Cupón',value:'4'},
    {label:'Yape',value:'5'},
    {label:'Plin',value:'6'},
    {label:'Por Cobrar',value:'7'},
    {label:'Otro medio',value:'8'}
  ]
  ventaForm: FormGroup;
  mode: string = '';
  ventaNuevaMonto:number=0;
  venta: VentaExtendida = {
    _id: '',
    fecha: '',
    venta_detalle_id: '',
    total: '',
    tipo_pago: '',
    cantidad_cuota: 0,
    estado: '',
    cantidad: '',
    producto_id: '',
    precio: '',
    cliente_id: '',
    usuario_id: '',
    created_at: '',
    updated_at: '',
    cliente_nombre: '',
    usuario_nombre: ''
  };

  pet_asignado:string='Sin asignar';
  pet_asignadoId:string='';
  fechaActual = new Date();
  usuario_id:string='67cd3ffb2b98c15b3b2e9ba2';
  cliente_id: string = '';

  /*MODAL PAGOS INFORMATION */
  importeTotal:number=0;
  importeMensual:number=0;
  nro_cuotas:number=1;
  fechaPago:string='';
  importeTotalPagado:number=0;
  vueltoPagado:number=0;
  listaHTML='';
  pagos_cuotas:any[]=[];
  ventaData:any={
    _id:null,
    fecha:'',
    total:'',
    tipo_pago: '',
    cantidad_cuota: 0,
    estado: '',
    cliente_id:'',
    usuario_id:'',
    producto_id:'',
    cantidad:'',
    precio:'',
  };
  tipo_pago ='';
  pago:pago={} as pago;
  constructor(
    private fb: FormBuilder,
    private ventaService: VentaService,
    private detalle_ventaService: Detalle_ventaService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private clienteService: ClienteService,
    private usuarioService: UsuarioService,
    private productoService: ProductoService,
    private categoria_productoService: Categoria_productoService,
    private mascotaService: MascotaService,
    private pagoService:PagoService
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
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.loadClientes();
    this.loadUsuarios();
    this.loadProductos();
    this.loadCategoria_productos();
    this.loadDetalle_ventas();
    this.loadMascotas();
  }

  private loadClientes(): void {
    this.clienteService.getAll().subscribe({
      next: (data) => {
        this.clientes = data;
        this.selected_cliente = this.clientes.map(cliente => ({
          label: cliente.nombres,
          value: cliente._id
        }));
        this.checkDataAndLoadVentas();
      },
      error: (err) => console.error('Error al cargar clientes:', err)
    });
  }

  private loadUsuarios(): void {
    this.usuarioService.getAll().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.selected_usuario = this.usuarios.map(usuario => ({
          label: usuario.nombre,
          value: usuario._id
        }));
        this.checkDataAndLoadVentas();
      },
      error: (err) => console.error('Error al cargar usuarios:', err)
    });
  }

  private loadProductos(): void {
    this.productoService.getAll().subscribe({
      next: (data) => {
        this.productos = data;
        this.filteredVentas = [...this.productos];
        this.selected_producto = this.productos.map(producto => ({
          label: producto.descripcion,
          value: producto._id
        }));
        this.checkDataAndLoadVentas();
      },
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  private loadCategoria_productos(): void {
    this.categoria_productoService.getAll().subscribe({
      next: (data) => {
        this.categoria_productos = data;
        this.selected_categoria_producto = data.map(categoria_producto => ({
          label: categoria_producto.nombre,
          value: categoria_producto._id
        }));
        this.checkDataAndLoadVentas();
      },
      error: (err) => console.error('Error al cargar Categoria_productos:', err)
    });
  }

  private loadDetalle_ventas(): void {
    this.detalle_ventaService.getAll().subscribe({
      next: (data) => {
        this.detalle_ventas = data;
        this.checkDataAndLoadVentas();
      },
      error: (err) => console.error('Error al cargar Detalle_ventas:', err)
    });
  }
  private loadMascotas(): void {
    this.mascotaService.getAll().subscribe({
      next: (data) => {
        this.mascotas = data;
        this.selected_mascota = data.map(mascota => ({
          label: mascota.nombre,
          value: mascota._id
        }));
        this.checkDataAndLoadVentas();

      },
      error: (err) => console.error('Error al cargar Detalle_ventas:', err)
    });
  }
  private checkDataAndLoadVentas(): void {
    if (this.clientes.length > 0 &&
      this.usuarios.length > 0 &&
      this.productos.length > 0 &&
      this.detalle_ventas.length > 0) {
      this.loadVentas();
    }
  }

  private loadVentas(): void {
    this.ventaService.getAll().subscribe({
      next: (data) => {
        this.ventas = data.map(venta => this.extendVentaData(venta));
        this.historial_ventas = data.map(venta => this.createHistorialVenta(venta));

        this.logDataForDebugging();
      },
      error: (err) => console.error('Error al cargar Ventas:', err)
    });
  }

  private extendVentaData(venta: Venta): VentaExtendida {
    const detalle = this.findDetalleVenta(venta._id);

    return {
      ...venta,
      cantidad: detalle?.cantidad || '0',
      precio: detalle?.precio_venta || '0',
      producto_id: detalle?.producto_id || '',
      venta_detalle_id: detalle?._id || '0',
      cliente_nombre: this.findClienteName(venta.cliente_id),
      usuario_nombre: this.findUsuarioName(venta.usuario_id)
    };
  }

  private createHistorialVenta(venta: Venta): HistorialVenta {
    let detalle = this.findDetalleVenta(venta._id);
    let producto = detalle ? this.findProduct(detalle.producto_id) : null;
    let venta_total = this.calculateVentaTotal(detalle);
    let mascota = this.findMascota(venta.cliente_id);

    return {
      cliente: mascota?.nombre || '',//this.findClienteName(venta.cliente_id),
      producto: producto?.nombre || '',
      descripcion: producto?.descripcion || '',
      tamano: producto?.tamano || '',
      cantidad: detalle?.cantidad || '0',
      precio: detalle?.precio_venta || '0',
      venta_total: venta_total.toString()
    };
  }

  private findDetalleVenta(venta_id: string): Detalle_venta | undefined {
    return this.detalle_ventas.find(d => d.venta_id === venta_id);
  }

  private findClienteName(cliente_id: string): string {
    return this.clientes.find(c => c._id === cliente_id)?.nombres || 'Sin Cliente';
  }

  private findUsuarioName(usuario_id: string): string {
    return this.usuarios.find(u => u._id === usuario_id)?.nombre || 'Sin Usuario';
  }

  private findProduct(producto_id: string): Producto | undefined {
    return this.productos.find(p => p._id === producto_id);
  }

  private calculateVentaTotal(detalle?: Detalle_venta): number {
    if (!detalle) return 0;
    return Number(detalle.cantidad || 0) * Number(detalle.precio_venta || 0);
  }
  private findMascota(cliente_id: string):Mascota | undefined{
    return this.mascotas.find(c => c.cliente_id === cliente_id);
  }
  private logDataForDebugging(): void {
   // console.log('----VENTAS---', JSON.stringify(this.ventas, null, 2));
   // console.log('----DETALLE VENTAS---', JSON.stringify(this.detalle_ventas, null, 2));
   // console.log('----HISTORIAL VENTAS---', JSON.stringify(this.historial_ventas, null, 2));
  }

  applyGlobalFilter(): void {
    const filterValue = this.globalFilter.toLowerCase().trim();

    if (!filterValue) {
      this.filteredVentas = [...this.productos];
      return;
    }

    this.filteredVentas = this.productos.filter(producto =>
      Object.values(producto).some(
        value => value && value.toString().toLowerCase().includes(filterValue)
      ));  // <-- Falta ) para cerrar el some()
  }

  openModal(mode: 'Nuevo' | 'Editar', venta?: VentaExtendida): void {
    this.mode = mode;
    this.modalTitle = `${mode} Venta`;
    this.modalVisible = true;

    if (mode === 'Editar' && venta) {
      const fecha = this.formatDate(venta.fecha);
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
  openModalPago(mode: 'Nuevo' | 'Editar', venta?: VentaExtendida): void {
    this.mode = mode;
    this.modalPagoTitle = `INFORMACIÓN DE PAGO`;
    this.calcularMontoPagar();
    this.modalPagoVisible = true;
    this.fechaPago =  this.formatDatePicker(this.fechaActual);
   // console.log(this.fechaPago)
    if (mode === 'Editar' && venta) {


    } else {
      this.importeMensual = this.ventaNuevaMonto;
      this.importeTotal = this.ventaNuevaMonto;
    }
  }

  // Función para generar las cuotas
  generarCuotas(fechaInicio: any, monto: any, cuotas: any) {
    this.pagos_cuotas = []; // Limpiamos el array antes de generar nuevas cuotas

    const [dia, mes, anio] = fechaInicio.split('/');
    let fecha = new Date(anio, mes - 1, dia);

    this.listaHTML = '<ul>';

    for (let i = 1; i <= cuotas; i++) {
      const nuevaFecha = new Date(fecha);
      nuevaFecha.setMonth(fecha.getMonth() + (i - 1));

      const diaFormateado = String(nuevaFecha.getDate()).padStart(2, '0');
      const mesFormateado = String(nuevaFecha.getMonth() + 1).padStart(2, '0');
      const fechaFormateada = `${diaFormateado}/${mesFormateado}/${nuevaFecha.getFullYear()}`;
      const numeroCuota = String(i).padStart(2, '0');

      this.listaHTML += `<li>${numeroCuota} Monto:${monto} Fecha: ${fechaFormateada}</li>`;

      this.pagos_cuotas.push({
        cuota: numeroCuota,
        monto: monto,
        estado: i === 1 ? 'Pagado' : 'Pendiente',
        fecha_vencimiento: fechaFormateada
      });
    }

    this.listaHTML += '</ul>';
  }

  calcularPagosCuotas() {
    // Verificamos que tengamos los datos necesarios
    if (!this.importeTotal || !this.nro_cuotas || this.nro_cuotas <= 0) {
      console.error('Datos incorrectos para calcular cuotas');
      return;
    }
    // Calculamos el importe mensual (división simple sin intereses)
    this.importeMensual = this.importeTotal / this.nro_cuotas;
    // Redondeamos a 2 decimales (opcional)
    this.importeMensual = Math.round(this.importeMensual * 100) / 100;
    // Calculamos el total a pagar (en este caso igual al importeTotal)
   // this.importeTotalPagado = this.importeTotal
    // Inicializamos el vuelto (si aplica)

    this.importeTotalPagado > this.importeMensual ? this.calcularVuelto(): this.vueltoPagado = 0;
    this.generarCuotas(this.fechaPago, this.importeMensual,this.nro_cuotas);

  }
  calcularVuelto(){
    this.vueltoPagado = this.importeTotalPagado - this.importeMensual;
  }
  onTipoPagoChange($event:any){
   // console.log("onTipoPagoChange"+JSON.stringify($event))
   // console.log(JSON.stringify($event))
    this.tipo_pago = $event.value.label;
   // console.log("tipo_pago"+this.tipo_pago);
    switch(this.tipo_pago) {
      case 'Por Cobrar':
       // console.log('Si por cuotas')
        this.calcularPagosCuotas()
        break;
      default:
    //  console.log('No por cuotas')
    }
  }
  confirmarEliminacion(venta: Venta): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el Venta: ${venta.fecha}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => this.deleteVenta(venta)
    });
  }

  deleteVenta(venta: Venta): void {
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

  calculateNewProductStock(producto_id: string, cantidad: string): void {
    this.productoService.getById(producto_id).subscribe({
      next: (data: any) => {
        const producto = data.producto;
        const stockExistente = data.producto.stock;
        const stockNuevo = Number(stockExistente) - Number(cantidad);

        producto.stock = stockNuevo.toString();
        this.actualizaStockProducto(producto);
      },
      error: (err) => console.error('Error de producto Encontrado:', err)
    });
  }

  actualizaStockProducto(producto: Producto): void {
    this.productoService.update(producto._id, producto).subscribe({
      next: (data: any) => {
      //  console.log('Stock de producto:' + data.nombre + ' Nuevo Stock es:' + data.stock);
        this.loadInitialData();
      },
      error: (err) => console.error('Error de producto Encontrado:', err)
    });
  }

  productoUpdateStock(producto_id: string, cantidad: string): void {
    this.calculateNewProductStock(producto_id, cantidad);
  }

  saveVentaDetalle(venta_detalle: Detalle_venta): void {
    if (this.mode === 'Nuevo') {
      this.detalle_ventaService.create(venta_detalle).subscribe({
        next: (response: any) => {
          this.productoUpdateStock(venta_detalle.producto_id, venta_detalle.cantidad);
        },
        error: (err) => console.error('Error al guardar el venta:', err)
      });
    } else {
      this.detalle_ventaService.update(venta_detalle._id, venta_detalle).subscribe({
        next: () => this.productoUpdateStock(venta_detalle.producto_id, venta_detalle.cantidad),
        error: (err) => console.error('Error al actualizar detalle venta:', err)
      });
    }
  }

  saveVenta(data: any): void {
    const venta = {
      _id: data._id,
      fecha: this.convertDateToISO(data.fecha),
      total: data.total,
      tipo_pago: data.tipo_pago === 'Por Cobrar' ? 'cuotas' : 'contado',
      cantidad_cuota:  data.cantidad_cuota,
      estado:  data.estado,
      cliente_id: data.cliente_id,
      usuario_id: data.usuario_id,
      created_at: this.convertDateToISO(data.fecha),
      updated_at: this.convertDateToISO(data.fecha)
    };

    const venta_detalle = {
      _id: '',
      venta_id: '',
      producto_id: data.producto_id,
      cantidad: data.cantidad,
      precio_venta: data.precio,
      created_at: this.convertDateToISO(data.fecha),
      updated_at: this.convertDateToISO(data.fecha),
    };

    if (this.mode === 'Nuevo') {
      this.ventaService.create(venta).subscribe({
        next: (response: any) => {
          venta_detalle.venta_id = response.data._id;
          this.saveVentaDetalle(venta_detalle);
          //this.loadVentas();
          this.mensajeConfirmacion(venta, "Registro Creado");
          this.modalVisible = false;
          this.registraPago(response.data._id);
        },
        error: (err) => console.error('Error al guardar el venta:', err)
      });
    } else {
      venta_detalle._id = data.venta_detalle_id;
      venta_detalle.venta_id = data._id;

      this.ventaService.update(venta._id, venta).subscribe({
        next: () => {
          this.saveVentaDetalle(venta_detalle);
          //this.loadVentas();
          this.mensajeConfirmacion(venta, "Registro Actualizado");
          this.modalVisible = false;
        },
        error: (err) => console.error('Error al actualizar venta:', err)
      });
    }
  }

  saveRegistro(): void {
    if (this.ventaForm.valid) {
      const data = this.ventaForm.value;
      this.saveVenta(data);
    }
  }

  onChangeCliente(e: any): void {
    this.ventaForm.patchValue({ cliente_id: e.value });
  }

  onChangeUsuario(e: any): void {
    this.ventaForm.patchValue({ usuario_id: e.value });
  }

  onChangeProducto(e: any): void {
    this.ventaForm.patchValue({ producto_id: e.value });
  }

  mensajeConfirmacion(venta: Venta, mensaje: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: `Venta "${venta.fecha}" ${mensaje}`
    });
  }

  calcularTotal(): void {
    const total = this.ventaForm.value.cantidad * this.ventaForm.value.precio;
    this.ventaForm.patchValue({ total: total });
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

  realizarVenta(){
    this.mode ='Nuevo';
    const fecha = this.formatDatePicker(this.fechaActual);
    let estado ='';
    if(this.nro_cuotas==1){
      estado='pagada';
    }else{
      estado='activa';
    }

    this.itemsVenta.forEach(item => {
      this.ventaData={
        _id:null,
        fecha:fecha,
        total:item.subtotal,
        tipo_pago: this.tipo_pago,
        cantidad_cuota:  this.nro_cuotas,
        estado:  estado,
        cliente_id:this.cliente_id,
        usuario_id:this.usuario_id,
        producto_id:item.producto_id,
        cantidad:item.stock,
        precio:item.precio_venta,
      }
     // console.log(JSON.stringify(this.ventaData,null,2))
      this.saveVenta(this.ventaData);
    });

   // console.log('-------------MASCOTAS------');
   // console.log(JSON.stringify(this.mascotas,null,2));
   // console.log('-------------CLIENTES------');
   // console.log(JSON.stringify(this.clientes,null,2));
   // console.log('-------------ITEM-VENTAS------');
   // console.log(JSON.stringify(this.itemsVenta,null,2));


  }
  registarVentaPago(){
    this.realizarVenta();
    //this.registraPago(venta_id);
    this.modalPagoVisible = false;
  }
  registraPago(venta_id: any): void {
    // Verificamos que hayan cuotas para procesar
    if (!this.pagos_cuotas || this.pagos_cuotas.length === 0) {
      console.error('No hay cuotas para registrar');
      return;
    }

    // Procesamos cada cuota
    const pagosArray: Pago[] = [];
    this.pagos_cuotas.forEach((p, i) => {
      // Convertimos la fecha al formato ISO que usualmente espera el backend
      const fechaPagoISO = i === 0 ? new Date().toISOString() : 'null';
      const fechaVencimientoISO = this.convertDateToISO(p.fecha_vencimiento);
      // AQUI EL ARRAY CREO

      let pago: Pago = {
        _id: '', // El backend probablemente lo genera automáticamente
        venta_id: venta_id,
        medio_pago: i === 0 ? this.tipo_pago : 'Pendiente', // Solo la primera tiene medio de pago
        cuota: p.cuota,
        monto: p.monto.toString(),
        estado: p.estado,
        fecha_pago: i === 0 ? fechaPagoISO :'FALTA', // Solo la primera tiene fecha de pago
        fecha_vencimiento: fechaVencimientoISO,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      // Agregamos el pago al array
      pagosArray.push(pago);

      this.pagoService.create(pago).subscribe({
        next: (response: any) => {
          console.log('Pago registrado:', response);
        },
        error: (err) => {
          console.error('Error al guardar el pago:', err);
          // Aquí podrías mostrar un mensaje al usuario
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Error al registrar pago de cuota ${p.cuota}`
          });
        }
      });


    });

    console.log(JSON.stringify(pagosArray,null,2))
  }
  calcularMontoPagar(){
    let montos: number[] = this.itemsVenta.map(item => {
      return parseInt(item.precio_venta) * parseInt(item.stock);
    });
    this.ventaNuevaMonto = montos.reduce((total, monto) => total + monto, 0);
  }
  onCheckboxTogglex(): void {
   // console.log(JSON.stringify(this.selected_checkbox_producto, null, 2));
    let montos: number[] = this.selected_checkbox_producto.map(item => {
      return parseInt(item.precio_venta) * parseInt(item.stock);
    });
    this.ventaNuevaMonto = montos.reduce((total, monto) => total + monto, 0);
  }
  onAddProductToSale($event:any):void{
    const productoId = $event.value;
    // Buscar el producto en la lista completa
    const productoSeleccionado = this.productos.find(p => p._id === productoId);
    if (!productoSeleccionado) {
      console.warn('Producto no encontrado');
      return;
    }
    // Verificar si el producto ya está en itemsVenta
    const itemExistenteIndex = this.itemsVenta.findIndex(item => item._id === productoId);

    if (itemExistenteIndex >= 0) {
      // Si existe, incrementar cantidad
      this.itemsVenta[itemExistenteIndex].stock = String(Number(this.itemsVenta[itemExistenteIndex].stock)+1);
      this.itemsVenta[itemExistenteIndex].subtotal = String(Number(this.itemsVenta[itemExistenteIndex].precio_venta) * Number(this.itemsVenta[itemExistenteIndex].stock));

    } else {
      // Si no existe, agregar nuevo item
      this.itemsVenta.push({
        _id: productoSeleccionado._id,
        usuario_id:this.usuario_id,
        cliente_id:'',
        tipo_pago: '',
        cantidad_cuota: 0,
        estado: '',
        mascota: this.pet_asignado,
        producto_id:productoId,
        nombre: productoSeleccionado.nombre,
        descripcion: productoSeleccionado.descripcion,
        precio_venta: productoSeleccionado.precio_venta,
        tamano: productoSeleccionado.tamano,
        stock: '1',
        subtotal: productoSeleccionado.precio_venta
      });
    }

  }

  onUpdateProductToSaleQuantity(p:itemsVenta,i:number){
   // console.log("onUpdateProductToSaleQuantity"+p.stock+'  '+i)
    this.itemsVenta[i].stock = p.stock;
    this.itemsVenta[i].subtotal = String(Number(this.itemsVenta[i].precio_venta) * Number(this.itemsVenta[i].stock));

  }

  onUpdateProductToSalePrice(p:itemsVenta,i:number){
   // console.log("onUpdateProductToSalePrice"+p.precio_venta+'  '+i)
    this.itemsVenta[i].precio_venta = p.precio_venta;
    this.itemsVenta[i].subtotal = String(Number(this.itemsVenta[i].precio_venta) * Number(this.itemsVenta[i].stock));
  }

  onAddMascotaToSale($event:any){
    let mascota = $event.value;
    this.pet_asignado=mascota.label;
    this.pet_asignadoId=mascota.value;

    this.cliente_id = this.mascotas.find(m => m._id === this.pet_asignadoId)?.cliente_id || '';
    this.itemsVenta = this.itemsVenta.map(item => ({
      ...item,
      mascota: this.pet_asignado,
      cliente_id:this.cliente_id
    }));

  }

  protected readonly length = length;
}
