import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

// Services
import { Historia_clinicaService } from '../../services/historia_clinica.service';
import { MascotaService } from '../../../mascotas/services/mascota.service';
import { UsuarioService } from '../../../usuarios/services/usuario.service';
import { ClienteService } from '../../../clientes/services/cliente.service';
import { RazaService } from '../../../razas/services/raza.service';
import { EspecieService } from '../../../especies/services/especie.service';
// Interfaces
import { Historia_clinica } from '../../interfaces/historia_clinica.interface';
import { Mascota } from '../../../mascotas/interfaces/mascota.interface';
import { Usuario } from '../../../usuarios/interfaces/usuario.interface';
import {Producto} from "../../../productos/interfaces/producto.interface";
import {Cliente} from "../../../clientes/interfaces/cliente.interface";
import {Raza} from "../../../razas/interfaces/raza.interface";
import {Especie} from "../../../especies/interfaces/especie.interface";
type itemHistoria = Omit<Historia_clinica, 'created_at'|'updated_at'>& {
  _id:string;
  codigo_hu: string;
  mascota: string;
  cliente: string;
  raza: string;
  especie: string;
  edad: string;
};

@Component({
  selector: 'app-historia_clinica-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class Historia_clinicaListComponent implements OnInit {
  // Properties
  historia_clinicas: Historia_clinica[] = [];
  filteredHistoria_clinicas: Historia_clinica[] = [];
  mascotas: Mascota[] = [];
  razas: Raza[] = [];
  especies: Especie[] = [];
  usuarios: Usuario[] = [];
  clientes: Cliente[] = [];

  selected_mascota: { label: string; value: string }[] = [];
  selected_usuario: { label: string; value: string }[] = [];
  selected_checkbox_historia: any[] = [];

  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  mode: string = '';
  historia_clinicaForm: FormGroup;

  codigoHU: string = '';
  itemsHistoria:itemHistoria[]=[];
  itemHistoria: itemHistoria = {} as itemHistoria;

  modoItem:boolean=true;
  modoDetalle:boolean=false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly historia_clinicaService: Historia_clinicaService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly mascotaService: MascotaService,
    private readonly usuarioService: UsuarioService,
    private readonly clienteService:ClienteService,
    private readonly razaService:RazaService,
    private readonly especieService:EspecieService

  ) {
    this.historia_clinicaForm = this.fb.group({
      _id: [null],
      mascota_id: ['', Validators.required],
      fecha: ['', Validators.required],
      peso: ['', Validators.required],
      tipo_visita: ['', Validators.required],
      signo: ['', Validators.required],
      alergia: ['', Validators.required],
      fecha_proxima_control: ['', Validators.required],
      frecuencia_cardiaca: ['', Validators.required],
      frecuencia_respiratoria: ['', Validators.required],
      temperatura: ['', Validators.required],
      prueba_complementaria: ['', Validators.required],
      tllc: ['', Validators.required],
      diagnostico: ['', Validators.required],
      tratamiento: ['', Validators.required],
      archivo: ['', Validators.required],
      atendido_por: ['', Validators.required],
      usuario_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
  }
  // Initialization Methods
  private loadInitialData(): void {
    this.loadMascotas();
    this.loadUsuarios();
    this.loadHistoria_clinicas();
    this.loadClientes();
    this.loadEspecies();
    this.loadRazas();
  }

  // Data Loading Methods
  private loadHistoria_clinicas(): void {
    this.historia_clinicaService.getAll().subscribe({
      next: (data) => {
        this.historia_clinicas = data.map(historia_clinica => ({
          ...historia_clinica,
          mascota_nombre: this.getMascotaNombre(historia_clinica.mascota_id),
          usuario_nombre: this.getUsuarioNombre(historia_clinica.usuario_id)
        }));
        this.filteredHistoria_clinicas = [...this.historia_clinicas];

      },
      error: (err) => console.error('Error al cargar Historia_clinicas:', err)
    });
  }

  private loadMascotas(): void {
    this.mascotaService.getAll().subscribe({
      next: (data) => {
        this.mascotas = data;
        this.selected_mascota = this.mascotas.map((mascota, index) => ({
          label: `${mascota.nombre}-HU00${index + 1}`,
          value: mascota._id
        }));
      },
      error: (err) => console.error('Error al cargar mascotas:', err)
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
      },
      error: (err) => console.error('Error al cargar usuarios:', err)
    });
  }
  private loadClientes(): void {
    this.clienteService.getAll().subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: (err) => console.error('Error al cargar clientes:', err)
    });
 }
  private loadEspecies():void {
    this.especieService.getAll().subscribe({
      next: (data) => {
        this.especies = data.map(especie=>({
          ...especie,

        }));

      },
      error: (err) => {
        console.error('Error al cargar Especies:', err);
      }
    });
  }

  private loadRazas():void {
    this.razaService.getAll().subscribe({
      next: (data) => {
        this.razas = data;
      },
      error: (err) => {
        console.error('Error al cargar Razas:', err);
      }
    });
  }

  // Helper Methods
  private getMascotaNombre(mascotaId: string): string {
    return this.mascotas.find(mascota => mascota._id === mascotaId)?.nombre || 'Sin Mascota';
  }

  private getUsuarioNombre(usuarioId: string): string {
    return this.usuarios.find(usuario => usuario._id === usuarioId)?.nombre || 'Sin Usuario';
  }

  // UI Methods
  applyGlobalFilter(): void {
    const filterValue = this.globalFilter.toLowerCase().trim();

    if (!filterValue) {
      this.filteredHistoria_clinicas = [...this.historia_clinicas];
      return;
    }

    this.filteredHistoria_clinicas = this.historia_clinicas.filter(historia_clinica =>
      Object.values(historia_clinica).some(
        value => value && value.toString().toLowerCase().includes(filterValue)
      ));
  }

  openModal(mode: 'Nuevo' | 'Editar', historia_clinica?: Historia_clinica): void {
    this.mode = mode;
    this.modalTitle = `${mode} Historia_clinica`;
    this.modalVisible = true;

    if (mode === 'Editar' && historia_clinica) {
      this.historia_clinicaForm.patchValue({
        _id: historia_clinica._id,
        mascota_id: historia_clinica.mascota_id,
        fecha: historia_clinica.fecha,
        peso: historia_clinica.peso,
        tipo_visita: historia_clinica.tipo_visita,
        signo: historia_clinica.signo,
        alergia: historia_clinica.alergia,
        fecha_proxima_control: historia_clinica.fecha_proxima_control,
        frecuencia_cardiaca: historia_clinica.frecuencia_cardiaca,
        frecuencia_respiratoria: historia_clinica.frecuencia_respiratoria,
        temperatura: historia_clinica.temperatura,
        prueba_complementaria: historia_clinica.prueba_complementaria,
        tllc: historia_clinica.tllc,
        diagnostico: historia_clinica.diagnostico,
        tratamiento: historia_clinica.tratamiento,
        archivo: historia_clinica.archivo,
        atendido_por: historia_clinica.atendido_por,
        usuario_id: historia_clinica.usuario_id
      });
    } else {
      this.historia_clinicaForm.reset();
    }
  }

  confirmarEliminacion(historia_clinica: Historia_clinica): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar la historia clínica de la mascota: ${this.getMascotaNombre(historia_clinica.mascota_id)}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => this.deleteHistoria_clinica(historia_clinica)
    });
  }

  // CRUD Operations
  private deleteHistoria_clinica(historia_clinica: Historia_clinica): void {
    this.historia_clinicaService.delete(historia_clinica._id).subscribe({
      next: () => {
        this.loadHistoria_clinicas();
        this.showMessage(
          'success',
          'Éxito',
          `Historia clínica eliminada correctamente`
        );
      },
      error: (err) => {
        console.error('Error al eliminar la historia clínica:', err);
        this.showMessage(
          'error',
          'Error',
          `No se pudo eliminar la historia clínica`
        );
      }
    });
  }

  saveRegistro(): void {
    if (this.historia_clinicaForm.valid) {
      const historia_clinica = this.historia_clinicaForm.value;

      if (historia_clinica._id === null) {
        delete historia_clinica._id;
      }

      const operation = this.mode === 'Nuevo'
        ? this.historia_clinicaService.create(historia_clinica)
        : this.historia_clinicaService.update(historia_clinica._id, historia_clinica);

      operation.subscribe({
        next: () => {
          this.modalVisible = false;
          this.loadHistoria_clinicas();
          this.showMessage(
            'success',
            'Éxito',
            `Historia clínica ${this.mode === 'Nuevo' ? 'creada' : 'actualizada'} correctamente`
          );
        },
        error: (err) => console.error(`Error al ${this.mode === 'Nuevo' ? 'crear' : 'actualizar'} la historia clínica:`, err)
      });
    }
  }

  // Event Handlers
  onChangeMascota(e: any): void {
    this.historia_clinicaForm.patchValue({ mascota_id: e.value });
  }

  onChangeUsuario(e: any): void {
    this.historia_clinicaForm.patchValue({ usuario_id: e.value });
  }

  // Utility Methods
  private showMessage(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail });
  }
  mongoIdToHUFormat(mongoId: string): string {
    // Extraemos los últimos 6 caracteres del ID (puedes ajustar esto)
    const hexPart = mongoId.slice(-6);

    // Convertimos a número (limitamos a 3 dígitos para que quepa en HUxxx)
    const numericValue = parseInt(hexPart, 16) % 1000; // %1000 asegura 3 dígitos

    // Formateamos como HU001, HU123, etc.
    return `HU${numericValue.toString().padStart(3, '0')}`;
  }
  private findMascota(mascota_id: string):Mascota | undefined{
    return this.mascotas.find(c => c._id === mascota_id);
  }
  private findCliente(cliente_id: string): any {
    return this.clientes.find(c => c._id === cliente_id);
  }
  private findEspecie(especie_id: string): any {
    return this.especies.find(c => c._id === especie_id);
  }
  private findRaza(_id: string): any {
    return this.razas.find(c => c._id === _id);
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
  formatDatePicker(date: Date): string {

    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }
  calcularEdad(fechaNacimiento: string | Date | null | undefined): string {
    console.log("fechaNacimiento ", fechaNacimiento);

    // Si la fecha está vacía, retornar "0 años, 0 meses y 0 días"
    if (!fechaNacimiento) {
      return "0 años, 0 meses y 0 días";
    }

    // Convertir la fecha de nacimiento a objeto Date
    const fechaNac = new Date(fechaNacimiento);
    const fechaActual = new Date();

    // Validar que la fecha de nacimiento sea válida
    if (isNaN(fechaNac.getTime())) {
      return "0 años, 0 meses y 0 días"; // O podrías lanzar un error si prefieres
    }

    // Validar que no sea una fecha futura
    if (fechaNac > fechaActual) {
      return "0 años, 0 meses y 0 días"; // O manejar como error
    }

    // Calcular diferencias
    let anos = fechaActual.getFullYear() - fechaNac.getFullYear();
    let meses = fechaActual.getMonth() - fechaNac.getMonth();
    let dias = fechaActual.getDate() - fechaNac.getDate();

    // Ajustar meses y días si es necesario
    if (dias < 0) {
      const ultimoDiaMesAnterior = new Date(
        fechaActual.getFullYear(),
        fechaActual.getMonth(),
        0
      ).getDate();
      dias += ultimoDiaMesAnterior;
      meses--;
    }
    if (meses < 0) {
      meses += 12;
      anos--;
    }

    return `${anos} años, ${meses} meses y ${dias} días`;
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

  onAddMascotaToGrid($event:any){

        const mascota_id    = $event.value.value;
        const mascota_label = $event.value.label;

        const mascota = this.findMascota(mascota_id);
        const especie = this.findEspecie(mascota_id);
        const raza = this.findRaza(mascota_id);
        const cliente = this.findCliente(mascota?.cliente_id ?? '');
        this.itemsHistoria = this.historia_clinicas
          .filter(h => h.mascota_id === mascota_id) // Filtra primero
          .map((h, index) => ({
            _id: h._id,
            codigo_hu: `HU00${index + 1}`,
            mascota: mascota?.nombre ?? "Sin nombre",
            mascota_id: mascota?._id ?? '',
            cliente: cliente.nombres,
            raza: raza?.descripcion ?? '',
            especie: especie?.descripcion ?? '',
            edad: String(this.calcularEdad(mascota?.fecha_nacimiento ?? '')),
            fecha: this.formatDate(h.fecha),
            peso:h.peso,
            tipo_visita:h.tipo_visita,
            signo:h.signo,
            alergia:h.alergia,
            fecha_proxima_control:h.fecha_proxima_control,
            frecuencia_cardiaca:h.frecuencia_cardiaca,
            frecuencia_respiratoria:h.frecuencia_respiratoria,
            temperatura:h.temperatura,
            prueba_complementaria:h.prueba_complementaria,
            tllc:h.tllc,
            diagnostico:h.diagnostico,
            tratamiento:h.tratamiento,
            archivo:h.archivo,
            atendido_por:h.atendido_por,
            usuario_id:h.usuario_id
          }));

  }
  onCheckboxTogglex(): void {
    /*console.log(JSON.stringify(this.selected_checkbox_historia, null, 2));
    let montos: number[] = this.selected_checkbox_historia.map(item => {
      return parseInt(item.precio_venta) * parseInt(item.stock);
    });
    this.ventaNuevaMonto = montos.reduce((total, monto) => total + monto, 0);*/
  }
  onItemToDetail(h:itemHistoria):void{
    this.codigoHU = h.codigo_hu;
    this.itemHistoria={
      _id: h._id,
      codigo_hu: h.codigo_hu,
      mascota:  h.mascota,
      mascota_id: h.mascota_id,
      cliente: h.cliente,
      raza: h.raza,
      especie:h.especie,
      edad: h.edad,
      fecha: h.fecha,
      peso:h.peso,
      tipo_visita:h.tipo_visita,
      signo:h.signo,
      alergia:h.alergia,
      fecha_proxima_control:this.formatDate(h.fecha_proxima_control),
      frecuencia_cardiaca:h.frecuencia_cardiaca,
      frecuencia_respiratoria:h.frecuencia_respiratoria,
      temperatura:h.temperatura,
      prueba_complementaria:h.prueba_complementaria,
      tllc:h.tllc,
      diagnostico:h.diagnostico,
      tratamiento:h.tratamiento,
      archivo:h.archivo,
      atendido_por:h.atendido_por,
      usuario_id:h.usuario_id
    }
    this.modoDetalle = true;
    this.modoItem=false

  }

}
