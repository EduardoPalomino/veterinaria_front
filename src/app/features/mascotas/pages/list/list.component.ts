import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MascotaService } from '../../services/mascota.service';
import { EspecieService } from '../../../especies/services/especie.service';
import { RazaService } from '../../../razas/services/raza.service';
import { SexoService } from '../../../sexos/services/sexo.service';
import { ClienteService } from '../../../clientes/services/cliente.service';
import { VentaService } from '../../../ventas/services/venta.service';
import { Detalle_ventaService } from '../../../detalle_ventas/services/detalle_venta.service';
import { ProductoService } from '../../../productos/services/producto.service';
import { Historia_clinicaService } from '../../../historia_clinicas/services/historia_clinica.service';
import { Mascota } from '../../interfaces/mascota.interface';
import { Especie } from '../../../especies/interfaces/especie.interface';
import { Raza } from '../../../razas/interfaces/raza.interface';
import { Sexo } from '../../../sexos/interfaces/sexo.interface';
import { Cliente } from '../../../clientes/interfaces/cliente.interface';
import { Venta } from '../../../ventas/interfaces/venta.interface';
import { Detalle_venta } from '../../../detalle_ventas/interfaces/detalle_venta.interface';
import { Producto } from '../../../productos/interfaces/producto.interface';
import { Historia_clinica } from '../../../historia_clinicas/interfaces/historia_clinica.interface';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../../../environments/environment";
interface mascotaDatosPersonales {
  _id: string;
  nombre: string;
  especie_id: string;
  raza_id: string;
  fecha_nacimiento: string;
  peso: string;
  sexo_id: string;
  cliente_id: string;
  foto: string;
  cliente: string;
  telefono: string;
  direccion: string;
  indicaciones_generales: string;
}

interface mascotaVentasProducto {
  _id: string;
  producto: string;
  cantidad: string;
}

interface mascotaHistoriaClinica {
  _id: string;
  fecha: string;
  tratamiento: string;
}

@Component({
  selector: 'app-mascota-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class MascotaListComponent implements OnInit {
  mascotas: Mascota[] = [];
  filteredMascotas: Mascota[] = [];
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  especies: Especie[] = [];
  razas: Raza[] = [];
  sexos: Sexo[] = [];
  clientes: Cliente[] = [];
  productos: Producto[] = [];
  ventas: Venta[] = [];
  detalle_ventas: Detalle_venta[] = [];
  historia_clinicas: Historia_clinica[] = [];
  mascotaDatosPersonales: mascotaDatosPersonales = {} as mascotaDatosPersonales;
  mascotaVentasProducto: mascotaVentasProducto[] = [];
  mascotaHistoriaClinica: mascotaHistoriaClinica[] = [];
  selected_especie: { label: string; value: string }[] = [];
  selected_raza: { label: string; value: string }[] = [];
  selected_sexo: { label: string; value: string }[] = [];
  selected_cliente: { label: string; value: string }[] = [];
  selected_mascota: { label: string; value: string }[] = [];
  mascotaForm: FormGroup;
  mode: string = '';
  isLoading: boolean = true;
  mascota_foto:string='';

  uploadedFile: File | null = null;
  previewImage: string | ArrayBuffer | null = null;
  apiUrl = `${environment.API_URL}`;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private mascotaService: MascotaService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private especieService: EspecieService,
    private razaService: RazaService,
    private sexoService: SexoService,
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private ventaService: VentaService,
    private detalle_ventaService: Detalle_ventaService,
    private historia_clinicaService:Historia_clinicaService
  ) {
    this.mascotaForm = this.fb.group({
      _id: [null],
      nombre: ['', Validators.required],
      foto: [''],
      especie_id: ['', Validators.required],
      raza_id: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      peso: ['', Validators.required],
      sexo_id: ['', Validators.required],
      cliente_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.isLoading = true;

    forkJoin([
      this.loadEspecies(),
      this.loadRazas(),
      this.loadSexos(),
      this.loadClientes(),
      this.loadProductos(),
      this.loadDetalle_ventas(),
      this.loadVentas(),
      this.loadMascotas(),
      this.loadHistoria_clinicas()
    ]).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar datos iniciales:', err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar datos iniciales'
        });
      }
    });
  }

  private loadHistoria_clinicas(): Observable<Historia_clinica[]> {
    return this.historia_clinicaService.getAll().pipe(
      tap(data => {
        this.historia_clinicas = data;
      })
    );
  }

  private loadProductos() {
    return this.productoService.getAll().pipe(tap(data => {
      this.productos = data;
    }));
  }

  private loadDetalle_ventas() {
    return this.detalle_ventaService.getAll().pipe(tap(data => {
      this.detalle_ventas = data;
    }));
  }

  private loadMascotas() {
    return this.mascotaService.getAll().pipe(tap(data => {
      this.mascotas = data.map(mascota => ({
        ...mascota,
        especie_nombre: this.especies.find(especie => especie._id === mascota.especie_id)?.descripcion || 'Sin Especie',
        raza_nombre: this.razas.find(raza => raza._id === mascota.raza_id)?.descripcion || 'Sin Raza',
        sexo_nombre: this.sexos.find(sexo => sexo._id === mascota.sexo_id)?.descripcion || 'Sin Sexo',
        cliente_nombre: this.clientes.find(cliente => cliente._id === mascota.cliente_id)?.nombres || 'Sin Cliente'
      }));

      this.filteredMascotas = [...this.mascotas];
      this.selected_mascota = data.map(mascota => ({
        label: mascota.nombre,
        value: mascota._id
      }));
    }));
  }

  private loadEspecies() {
    return this.especieService.getAll().pipe(tap(data => {
      this.especies = data;
      this.selected_especie = this.especies.map(especie => ({
        label: especie.descripcion,
        value: especie._id
      }));
    }));
  }

  private loadRazas() {
    return this.razaService.getAll().pipe(tap(data => {
      this.razas = data;
      this.selected_raza = this.razas.map(raza => ({
        label: raza.descripcion,
        value: raza._id
      }));
    }));
  }

  private loadSexos() {
    return this.sexoService.getAll().pipe(tap(data => {
      this.sexos = data;
      this.selected_sexo = this.sexos.map(sexo => ({
        label: sexo.descripcion,
        value: sexo._id
      }));
    }));
  }

  private loadClientes() {
    return this.clienteService.getAll().pipe(tap(data => {
      this.clientes = data;
      this.selected_cliente = this.clientes.map(cliente => ({
        label: cliente.nombres,
        value: cliente._id
      }));
    }));
  }

  private loadVentas() {
    return this.ventaService.getAll().pipe(tap(data => {
      this.ventas = data;
    }));
  }

  applyGlobalFilter() {
    const filterValue = this.globalFilter.toLowerCase().trim();

    if (!filterValue) {
      this.filteredMascotas = [...this.mascotas];
      return;
    }

    this.filteredMascotas = this.mascotas.filter((mascota) =>
      Object.values(mascota).some(
        (value) => value && value.toString().toLowerCase().includes(filterValue)
      ));
  }

  openModal(mode: 'Nuevo' | 'Editar', mascota?: any) {
    this.mode = mode;
    this.modalTitle = `${mode} Mascota`;
    this.modalVisible = true;

    if (mode === 'Editar' && mascota) {
      this.mascotaForm.patchValue({
        _id: mascota._id,
        nombre: mascota.nombre,
        foto: mascota.foto,
        especie_id: mascota.especie_id,
        raza_id: mascota.raza_id,
        fecha_nacimiento: mascota.fecha_nacimiento,
        peso: mascota.peso,
        sexo_id: mascota.sexo_id,
        cliente_id: mascota.cliente_id
      });
    } else {
      this.mascotaForm.reset();
    }
  }

  confirmarEliminacion(mascota: Mascota) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar la mascota: ${mascota.nombre}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.deleteMascota(mascota);
      }
    });
  }

  deleteMascota(mascota: Mascota) {
    this.mascotaService.delete(mascota._id).subscribe({
      next: () => {
        this.loadMascotas();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Mascota "${mascota.nombre}" eliminada correctamente`
        });
      },
      error: (err) => {
        console.error('Error al eliminar la mascota:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo eliminar la mascota "${mascota.nombre}"`
        });
      }
    });
  }

 async saveRegistro() {
    if (this.mascotaForm.valid) {
      const mascota = this.mascotaForm.value;
      mascota._id === null && delete mascota._id;

      if (this.uploadedFile) {
        const imageUrl = await this.uploadFile();
        mascota.foto = imageUrl;
      }

      if (this.mode === 'Nuevo') {
        this.mascotaService.create(mascota).subscribe({
          next: (data) => {
            this.mascotas.push(data);
            this.modalVisible = false;
            this.loadMascotas();
            this.mensajeConfirmacion(mascota, "Registro Creado");

            // Resetear el estado de la imagen
            this.uploadedFile = null;
            this.previewImage = null;
          },
          error: (err) => {
            console.error('Error al guardar la mascota:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al guardar la mascota'
            });
          }
        });
      } else {
        this.mascotaService.update(mascota._id, mascota).subscribe({
          next: () => {
            this.modalVisible = false;
            this.loadMascotas();
            this.mensajeConfirmacion(mascota, "Registro Actualizado");

            // Resetear el estado de la imagen
            this.uploadedFile = null;
            this.previewImage = null;
          },
          error: (err) => {
            console.error('Error al actualizar la mascota:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al actualizar la mascota'
            });
          }
        });
      }
    }
  }

  onChangeEspecie(e: any) {
    this.mascotaForm.patchValue({ especie_id: e.value });
  }

  onChangeRaza(e: any) {
    this.mascotaForm.patchValue({ raza_id: e.value });
  }

  onChangeSexo(e: any) {
    this.mascotaForm.patchValue({ sexo_id: e.value });
  }

  onChangeCliente(e: any) {
    this.mascotaForm.patchValue({ cliente_id: e.value });
  }

  mensajeConfirmacion(mascota: Mascota, mensaje: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: `Mascota "${mascota.nombre}" ${mensaje}`
    });
  }

  private findMascota(mascota_id: string): Mascota | undefined {
    return this.mascotas.find(m => m._id === mascota_id);
  }

  private findCliente(cliente_id: string): Cliente | undefined {
    return this.clientes.find(c => c._id === cliente_id);
  }

  private findVenta(venta_id: string): Venta | undefined {
    return this.ventas.find(v => v._id === venta_id);
  }

  private findVentaDetalle(venta_id: string): Detalle_venta | undefined {
    return this.detalle_ventas.find(v => v.venta_id === venta_id);
  }

  private findProducto(producto_id: string): Producto | undefined {
    return this.productos.find(v => v._id === producto_id);
  }
  private findHistoria_clinicas(historia_clinicas_id: string): Historia_clinica | undefined {
    return this.historia_clinicas.find(h => h._id === historia_clinicas_id);
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
  buscarMascota($event: any) {
    if (this.isLoading) return;

    const mascota_id = $event.value;
    const mascota = this.findMascota(mascota_id);
    if (!mascota) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Mascota no encontrada'
      });
      return;
    }

    const cliente = this.findCliente(mascota.cliente_id);
    if (!cliente) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Cliente no encontrado'
      });
      return;
    }

    // Actualizar datos personales
    this.mascota_foto = mascota.foto;

    this.mascotaDatosPersonales = {
      _id: mascota_id,
      nombre: mascota.nombre,
      especie_id: mascota.especie_id,
      raza_id: mascota.raza_id,
      fecha_nacimiento: this.formatDate(mascota.fecha_nacimiento),
      peso: mascota.peso,
      sexo_id: mascota.sexo_id,
      cliente_id: mascota.cliente_id,
      foto: mascota.foto,
      cliente: cliente.nombres,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
      indicaciones_generales: cliente.indicacion_general || ''
    };

    // Filtrar y mapear ventas con validaciones
    this.mascotaVentasProducto = this.ventas
      .filter(v => v.cliente_id === cliente._id)
      .map(v => {
        const detalle_venta = this.findVentaDetalle(v._id);
        if (!detalle_venta) return null;

        const producto = this.findProducto(detalle_venta.producto_id);
        if (!producto) return null;

        return {
          _id: v._id,
          producto: producto.nombre,
          cantidad: detalle_venta.cantidad
        };
      })
      .filter(item => item !== null) as mascotaVentasProducto[];

    if (this.mascotaVentasProducto.length === 0) {
      this.messageService.add({
        severity: 'info',
        summary: 'Información',
        detail: 'No se encontraron ventas para esta mascota'
      });
    }

    this.mascotaHistoriaClinica = this.historia_clinicas
      .filter(h => h.mascota_id === mascota_id)
      .map(h => ({
        _id: h._id,
        fecha: this.formatDate(h.fecha),
        tratamiento: h.tratamiento
      }));


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
