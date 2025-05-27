import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Historia_clinicaService } from '../../services/historia_clinica.service';
import { MascotaService } from '../../../mascotas/services/mascota.service';
import { UsuarioService } from '../../../usuarios/services/usuario.service';
import { Historia_clinica } from '../../interfaces/historia_clinica.interface';
import { Mascota } from '../../../mascotas/interfaces/mascota.interface';
import { Usuario } from '../../../usuarios/interfaces/usuario.interface';

@Component({
  selector: 'app-historia_clinica-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class Historia_clinicaListComponent implements OnInit {
  historia_clinicas: Historia_clinica[] = [];
  filteredHistoria_clinicas: Historia_clinica[] = [];
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  mascotas: Mascota[]= [];
  usuarios: Usuario[]= [];
  selected_mascota:{ label: string; value: string }[]=[];
  selected_usuario:{ label: string; value: string }[]=[];
  historia_clinicaForm: FormGroup;
  mode:string='';

  constructor(
  private fb: FormBuilder,
  private historia_clinicaService: Historia_clinicaService,
  private confirmationService: ConfirmationService,
  private messageService: MessageService,
  private mascotaService:MascotaService,
  private usuarioService:UsuarioService
  ) {
    this.historia_clinicaForm = this.fb.group({
      _id: [null],
      mascota_id: ['', Validators.required],
      fecha: ['', Validators.required],
      motivo_consulta: ['', Validators.required],
      diagnostico: ['', Validators.required],
      tratamiento: ['', Validators.required],
      observaciones: ['', Validators.required],
      usuario_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
     this.loadMascotas();
this.loadUsuarios();
    this.loadHistoria_clinicas();
  }

  loadHistoria_clinicas() {
    this.historia_clinicaService.getAll().subscribe({
      next: (data) => {
        this.historia_clinicas = data.map(historia_clinica=>({
          ...historia_clinica,
          mascota_nombre:this.mascotas.find(mascota=>mascota._id==historia_clinica.mascota_id)?.nombre||'Sin Mascota',
          usuario_nombre:this.usuarios.find(usuario=>usuario._id==historia_clinica.usuario_id)?.nombre||'Sin Usuario'
        }));
        this.filteredHistoria_clinicas = [...this.historia_clinicas];
      },
      error: (err) => {
        console.error('Error al cargar Historia_clinicas:', err);
      }
    });
  }

loadMascotas() {
    this.mascotaService.getAll().subscribe({
      next: (data) => {
        this.mascotas = data;
        this.selected_mascota = this.mascotas.map(mascota => ({
          label: mascota.nombre,
          value: mascota._id
        }));
      },
      error: (err) => {
        console.error('Error al cargar mascotas:', err);
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
      this.filteredHistoria_clinicas = [...this.historia_clinicas];
      return;
    }

    this.filteredHistoria_clinicas = this.historia_clinicas.filter((historia_clinica) =>
        Object.values(historia_clinica).some(
            (value) =>
                value &&
                value.toString().toLowerCase().includes(filterValue)
        )
    );
  }

  openModal(mode: 'Nuevo' | 'Editar', historia_clinica?: Historia_clinica) {
    this.mode=mode;
    console.log(mode);
    this.modalTitle = `${mode} Historia_clinica`;
    this.modalVisible = true;

    if (mode === 'Editar' && historia_clinica) {
      this.historia_clinicaForm.patchValue({
       _id: historia_clinica._id,
      mascota_id: historia_clinica.mascota_id,
      fecha: historia_clinica.fecha,
      motivo_consulta: historia_clinica.motivo_consulta,
      diagnostico: historia_clinica.diagnostico,
      tratamiento: historia_clinica.tratamiento,
      observaciones: historia_clinica.observaciones,
      usuario_id: historia_clinica.usuario_id
      });
    } else {
      this.historia_clinicaForm.reset();
    }
  }

  confirmarEliminacion(historia_clinica: Historia_clinica) {
    console.log("Clic en eliminar:", historia_clinica);
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el Historia_clinica: ${historia_clinica.mascota_id}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.deleteHistoria_clinica(historia_clinica);
      }
    });
  }

deleteHistoria_clinica(historia_clinica: Historia_clinica) {
    this.historia_clinicaService.delete(historia_clinica._id).subscribe({
      next: () => {
        this.loadHistoria_clinicas();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Historia_clinica "${historia_clinica.mascota_id}" eliminado correctamente`
        });
      },
      error: (err) => {
        console.error('Error al eliminar el historia_clinica:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo eliminar el historia_clinica "${historia_clinica.mascota_id}"`
        });
      }
    });
  }

  saveRegistro() {
    if (this.historia_clinicaForm.valid) { // Verifica que el formulario sea válido
      const historia_clinica = this.historia_clinicaForm.value; // Obtener valores del formulario

      console.log(JSON.stringify(historia_clinica));
      historia_clinica._id === null && delete historia_clinica._id;
      console.log(JSON.stringify(historia_clinica));

      if (this.mode === 'Nuevo') {
        this.historia_clinicaService.create(historia_clinica).subscribe({
          next: (data) => {
            console.log('Historia_clinica guardado con éxito:', data);
            this.historia_clinicas.push(data); // Agregar el nuevo historia_clinica a la lista
            this.modalVisible = false; // Cerrar modal después de guardar
            this.loadHistoria_clinicas(); // Recargar lista de historia_clinicas
            this.mensajeConfirmacion(historia_clinica,"Registro Actualizado");
          },
          error: (err) => {
            console.error('Error al guardar el historia_clinica:', err);
          }
        });
      }else{
        this.historia_clinicaService.update(historia_clinica._id, historia_clinica).subscribe(() => {
          this.modalVisible = false;
          this.loadHistoria_clinicas();
          this.mensajeConfirmacion(historia_clinica,"Registro Actualizado");
        });
      }
    }
  }

  onChangeMascota(e: any) {
        this.historia_clinicaForm.patchValue({mascota_id:e.value});
       }
      onChangeUsuario(e: any) {
        this.historia_clinicaForm.patchValue({usuario_id:e.value});
       }

  mensajeConfirmacion(historia_clinica: Historia_clinica,mensaje:String){
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: ` Historia_clinica "${historia_clinica.mascota_id}" ${mensaje}`
    });
  }



}
