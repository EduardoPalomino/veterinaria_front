import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PagoService } from '../../services/pago.service';
import { ClienteService } from '../../../clientes/services/cliente.service';
import { MascotaService } from '../../../mascotas/services/mascota.service';
import { VentaService } from '../../../ventas/services/venta.service';
import { Pago } from '../../interfaces/pago.interface';
import { Mascota } from '../../../mascotas/interfaces/mascota.interface';
import { Cliente } from '../../../clientes/interfaces/cliente.interface';
import { Venta } from '../../../ventas/interfaces/venta.interface';
import {Producto} from "../../../productos/interfaces/producto.interface";

type ItemsPagos = Omit<Pago,'medio_pago'|' medio_pago'|'created_at'|'updated_at'>& {
  cliente: string;
  mascota: string;
};

@Component({
  selector: 'app-pago-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class PagoListComponent implements OnInit {
  pagos: Pago[] = [];
  itemsPagos: ItemsPagos[] = [];
  mascotas: Mascota[] = [];
  clientes: Cliente[] = [];
  ventas:Venta[]=[];
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  mode: string = '';
  cuota: string = '';
  fechaActual = new Date();

  selected_estado: { label: string; value: string }[] = [
    {label: 'Pagado', value: 'Pagado'},
    {label: 'Pendiente', value: 'Pendiente'}
  ];

  selected_medio_pago: { label: string; value: string }[] = [
    {label: 'Efectivo', value: 'Efectivo'},
    {label: 'Tarjeta Débito', value: 'Tarjeta Débito'},
    {label: 'Tarjeta Crédito', value: 'Tarjeta Crédito'},
    {label: 'Cupón', value: 'Cupón'},
    {label: 'Yape', value: 'Yape'},
    {label: 'Plin', value: 'Plin'},
    {label: 'Por Cobrar', value: 'Por Cobrar'},
    {label: 'Otro medio', value: 'Otro medio'}
  ];

  selected_cliente: { label: string; value: string }[] = [];
  selected_mascota: { label: string; value: string }[] = [];

  pagoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private pagoService: PagoService,
    private mascotaService: MascotaService,
    private clienteService: ClienteService,
    private ventaService: VentaService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.pagoForm = this.fb.group({
      _id: [null],
      busqueda_cliente: [''],
      busqueda_mascota: [''],
      fInicio: [''],
      fFin: [''],
      venta_id: ['', Validators.required],
      cuota: ['', Validators.required],
      monto: ['', Validators.required],
      estado: ['', Validators.required],
      medio_pago: ['', Validators.required],
      fecha_pago: ['', Validators.required],
      fecha_vencimiento: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.loadClientes();
    this.loadVentas();
    this.loadMascotas();
  }

  private checkDataAndLoadPagos(): void {
    if (this.clientes.length > 0 && this.mascotas.length > 0&& this.ventas.length > 0) {
      this.loadPagos();
    }
  }
  private loadVentas(): void {
    this.ventaService.getAll().subscribe({
      next: (data) => {
        this.ventas = data;
        this.checkDataAndLoadPagos();
      },
      error: (err) => console.error('Error al cargar Ventas:', err)
    });
  }

  private loadPagos(): void {
    this.pagoService.getAll().subscribe({
      next: (data) => {
        this.pagos = data;
        this.loadPagosClientesMascotas();
      },
      error: (err) => {
        console.error('Error al cargar Pagos:', err);
      }
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
        this.checkDataAndLoadPagos();
      },
      error: (err) => console.error('Error al cargar Detalle_ventas:', err)
    });
  }

  private loadClientes(): void {
    this.clienteService.getAll().subscribe({
      next: (data) => {
        this.clientes = data;
        this.selected_cliente = this.clientes.map(cliente => ({
          label: cliente.nombres,
          value: cliente._id
        }));
        this.checkDataAndLoadPagos();
      },
      error: (err) => console.error('Error al cargar clientes:', err)
    });
  }
  private loadPagosClientesMascotas():void{
    this.itemsPagos  = this.pagos.map(p => {
      const venta = this.findVenta(p.venta_id)!;
      const cliente = this.findCliente(venta.cliente_id)!;
      const mascota = this.findMascota(cliente._id)!;
      return {
        _id: p._id,
        venta_id: p.venta_id,
        medio_pago: p.medio_pago,
        cliente: cliente.nombres,
        mascota: mascota.nombre,
        cuota: p.cuota,
        monto: p.monto,
        estado: p.estado,
        fecha_pago: p.fecha_pago,
        fecha_vencimiento: p.fecha_vencimiento
      };
    });

  }

  private findMascota(cliente_id: string): Mascota | undefined {
    return this.mascotas.find(m => m.cliente_id === cliente_id);
  }
  private findCliente(cliente_id: string): Cliente | undefined {
    return this.clientes.find(c => c._id === cliente_id);
  }
  private findVenta(venta_id: string): Venta | undefined {
    return this.ventas.find(v => v._id === venta_id);
  }

  openModal(mode: 'Nuevo' | 'Editar', pago?: Pago) {
    this.mode = mode;
    console.log(mode);
    this.modalTitle = `${mode} Pago`;
    this.modalVisible = true;

    if (mode === 'Editar' && pago) {
      console.log(pago.estado)
      this.pagoForm.patchValue({
        _id: pago._id,
        venta_id: pago.venta_id,
        cuota: pago.cuota,
        monto: pago.monto,
        estado: pago.estado,
        medio_pago: pago.medio_pago,
        fecha_pago: pago.fecha_pago === 'FALTA' ? this.formatDate(pago.fecha_vencimiento) : this.formatDate(pago.fecha_pago),
        fecha_vencimiento: this.formatDate(pago.fecha_vencimiento)
      });
    } else {
      this.pagoForm.reset();
    }
  }

  confirmarEliminacion(pago: Pago) {
    console.log("Clic en eliminar:", pago);
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el Pago: ${pago.venta_id}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.deletePago(pago);
      }
    });
  }

  deletePago(pago: Pago) {
    this.pagoService.delete(pago._id).subscribe({
      next: () => {
        this.loadPagos();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Pago "${pago.venta_id}" eliminado correctamente`
        });
      },
      error: (err) => {
        console.error('Error al eliminar el pago:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo eliminar el pago "${pago.venta_id}"`
        });
      }
    });
  }

  saveRegistro() {
    if (this.pagoForm.valid) {
      const pago = this.pagoForm.value;
      console.log(JSON.stringify(pago));
      pago._id === null && delete pago._id;
      console.log(JSON.stringify(pago));

      if (this.mode === 'Nuevo') {
        this.pagoService.create(pago).subscribe({
          next: (data) => {
            console.log('Pago guardado con éxito:', data);
            this.pagos.push(data);
            this.modalVisible = false;
            this.loadPagos();
            this.mensajeConfirmacion(pago, "Registro Actualizado");
          },
          error: (err) => {
            console.error('Error al guardar el pago:', err);
          }
        });
      } else {
        pago.fecha_pago = this.convertDateToISO(pago.fecha_pago);
        pago.fecha_vencimiento = this.convertDateToISO(pago.fecha_vencimiento);
        this.pagoService.update(pago._id, pago).subscribe(() => {
          this.modalVisible = false;
          this.loadPagos();
          this.mensajeConfirmacion(pago, "Registro Actualizado");
        });
      }
    }
  }

  onChangeVenta(e: any) {
    this.pagoForm.patchValue({venta_id: e.value});
  }

  mensajeConfirmacion(pago: Pago, mensaje: String) {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: `Pago "${pago.venta_id}" ${mensaje}`
    });
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

  filtarCliente($event: any) {
    const cliente = $event.value;
    this.loadPagosClientesMascotas();
    if (!cliente) {
      this.loadPagosClientesMascotas();
      return;
    }
    // Filtrar itemsPagos por el nombre del cliente
    this.itemsPagos = this.itemsPagos.filter(item => item.cliente === cliente);
  }

  filtarMascota($event: any) {
    const mascota = $event.value;
    this.loadPagosClientesMascotas();
    if (!mascota) {
      this.loadPagosClientesMascotas();
      return;
    }
    this.itemsPagos = this.itemsPagos.filter(item => item.mascota === mascota);
  }

  filtarFechaVencimiento($event: any, tipoFecha: number) {
    this.loadPagosClientesMascotas();
    const fecha = this.formatDatePicker($event);
    const filtro = {
      inicio: tipoFecha === 1 ? fecha : '',
      fin: tipoFecha === 2 ? fecha : ''
    };
    if (!filtro.inicio && !filtro.fin) {
      return this.loadPagosClientesMascotas();
    }
    this.itemsPagos = this.itemsPagos.filter(item => {
      let itemFecha = this.formatDate(item.fecha_vencimiento);
      console.log(itemFecha)
      return (!filtro.inicio || itemFecha>= filtro.inicio) &&
        (!filtro.fin || itemFecha <= filtro.fin);
    });

  }

}
