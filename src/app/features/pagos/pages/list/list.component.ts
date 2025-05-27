import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PagoService } from '../../services/pago.service';
import { VentaService } from '../../../ventas/services/venta.service';
import { Pago } from '../../interfaces/pago.interface';
import { Venta } from '../../../ventas/interfaces/venta.interface';

@Component({
  selector: 'app-pago-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class PagoListComponent implements OnInit {
  // Variables de estado
  pagos: Pago[] = [];
  filteredPagos: Pago[] = [];
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  ventas: Venta[] = [];
  mode: string = '';
  cuota: string = '';
  fechaActual = new Date();

  // Opciones para selects
  selected_venta: { label: string; value: string }[] = [];
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

  // Formulario
  pagoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private pagoService: PagoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private ventaService: VentaService
  ) {
    this.pagoForm = this.fb.group({
      _id: [null],
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
    this.loadVentas();
    this.loadPagos();
  }

  // Métodos de carga de datos
  loadPagos() {
    this.pagoService.getAll().subscribe({
      next: (data) => {
        this.pagos = data.map(pago => ({
          ...pago,
          venta_nombre: this.ventas.find(venta => venta._id == pago.venta_id)?._id || 'Sin Venta'
        }));
        this.filteredPagos = [...this.pagos];
      },
      error: (err) => {
        console.error('Error al cargar Pagos:', err);
      }
    });
  }

  loadVentas() {
    this.ventaService.getAll().subscribe({
      next: (data) => {
        this.ventas = data;
        this.selected_venta = this.ventas.map(venta => ({
          label: venta._id,
          value: venta._id
        }));
      },
      error: (err) => {
        console.error('Error al cargar ventas:', err);
      }
    });
  }

  // Métodos de filtrado
  applyGlobalFilter() {
    const filterValue = this.globalFilter.toLowerCase().trim();
    console.log('Filtrando:', filterValue);

    if (!filterValue) {
      this.filteredPagos = [...this.pagos];
      return;
    }

    this.filteredPagos = this.pagos.filter((pago) =>
      Object.values(pago).some(
        (value) => value && value.toString().toLowerCase().includes(filterValue)
      )
    );
  }

  // Métodos de modal
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
        fecha_pago: pago.fecha_pago='FALTA'?this.formatDate(pago.fecha_vencimiento):this.formatDate(pago.fecha_pago),
        fecha_vencimiento: this.formatDate(pago.fecha_vencimiento)
      });
    } else {
      this.pagoForm.reset();
    }
  }

  // Métodos CRUD
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

  // Métodos de utilidad
  onChangeVenta(e: any) {
    this.pagoForm.patchValue({venta_id: e.value});
  }

  mensajeConfirmacion(pago: Pago, mensaje: String) {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: ` Pago "${pago.venta_id}" ${mensaje}`
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
}
