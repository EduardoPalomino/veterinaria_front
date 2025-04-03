import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MascotaService } from '../../services/mascota.service';
import { EspecieService } from '../../../especies/services/especie.service';
import { RazaService } from '../../../razas/services/raza.service';
import { SexoService } from '../../../sexos/services/sexo.service';
import { ClienteService } from '../../../clientes/services/cliente.service';
import { Mascota } from '../../interfaces/mascota.interface';
import { Especie } from '../../../especies/interfaces/especie.interface';
import { Raza } from '../../../razas/interfaces/raza.interface';
import { Sexo } from '../../../sexos/interfaces/sexo.interface';
import { Cliente } from '../../../clientes/interfaces/cliente.interface';

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
  especies: Especie[]= [];
  razas: Raza[]= [];
  sexos: Sexo[]= [];
  clientes: Cliente[]= [];
  selected_especie:{ label: string; value: string }[]=[];
  selected_raza:{ label: string; value: string }[]=[];
  selected_sexo:{ label: string; value: string }[]=[];
  selected_cliente:{ label: string; value: string }[]=[];
  mascotaForm: FormGroup;
  mode:string='';

  constructor(
  private fb: FormBuilder,
  private mascotaService: MascotaService,
  private confirmationService: ConfirmationService,
  private messageService: MessageService,
  private especieService:EspecieService,
  private razaService:RazaService,
  private sexoService:SexoService,
  private clienteService:ClienteService
  ) {
    this.mascotaForm = this.fb.group({
      _id: [null],
      nombre: ['', Validators.required],
      especie_id: ['', Validators.required],
      raza_id: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      peso: ['', Validators.required],
      sexo_id: ['', Validators.required],
      cliente_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
     this.loadEspecies();
this.loadRazas();
this.loadSexos();
this.loadClientes();
    this.loadMascotas();
  }

  loadMascotas() {
    this.mascotaService.getAll().subscribe({
      next: (data) => {
        this.mascotas = data.map(mascota=>({
          ...mascota,
          especie_nombre:this.especies.find(especie=>especie._id==mascota.especie_id)?.descripcion||'Sin Especie',
          raza_nombre:this.razas.find(raza=>raza._id==mascota.raza_id)?.descripcion||'Sin Raza',
          sexo_nombre:this.sexos.find(sexo=>sexo._id==mascota.sexo_id)?.descripcion||'Sin Sexo',
          cliente_nombre:this.clientes.find(cliente=>cliente._id==mascota.cliente_id)?.nombres||'Sin Cliente'
            }));
            this.filteredMascotas = [...this.mascotas];
          },
          error: (err) => {
            console.error('Error al cargar Mascotas:', err);
          }
    });
  }

loadEspecies() {
    this.especieService.getAll().subscribe({
      next: (data) => {
        this.especies = data;
        this.selected_especie = this.especies.map(especie => ({
          label: especie.descripcion,
          value: especie._id
        }));
      },
      error: (err) => {
        console.error('Error al cargar especies:', err);
      }
    });
  }
      loadRazas() {
    this.razaService.getAll().subscribe({
      next: (data) => {
        this.razas = data;
        this.selected_raza = this.razas.map(raza => ({
          label: raza.descripcion,
          value: raza._id
        }));
      },
      error: (err) => {
        console.error('Error al cargar razas:', err);
      }
    });
  }
      loadSexos() {
    this.sexoService.getAll().subscribe({
      next: (data) => {
        this.sexos = data;
        this.selected_sexo = this.sexos.map(sexo => ({
          label: sexo.descripcion,
          value: sexo._id
        }));
      },
      error: (err) => {
        console.error('Error al cargar sexos:', err);
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

  applyGlobalFilter() {
    const filterValue = this.globalFilter.toLowerCase().trim();
    console.log('Filtrando:', filterValue);

    if (!filterValue) {
      this.filteredMascotas = [...this.mascotas];
      return;
    }

    this.filteredMascotas = this.mascotas.filter((mascota) =>
        Object.values(mascota).some(
            (value) =>
                value &&
                value.toString().toLowerCase().includes(filterValue)
        )
    );
  }

  openModal(mode: 'Nuevo' | 'Editar', mascota?: Mascota) {
    this.mode=mode;
    console.log(mode);
    this.modalTitle = `${mode} Mascota`;
    this.modalVisible = true;

    if (mode === 'Editar' && mascota) {
      this.mascotaForm.patchValue({
       _id: mascota._id,
      nombre: mascota.nombre,
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
    console.log("Clic en eliminar:", mascota);
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el Mascota: ${mascota.nombre}?`,
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
          detail: `Mascota "${mascota.nombre}" eliminado correctamente`
        });
      },
      error: (err) => {
        console.error('Error al eliminar el mascota:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo eliminar el mascota "${mascota.nombre}"`
        });
      }
    });
  }

  saveRegistro() {
    if (this.mascotaForm.valid) { // Verifica que el formulario sea válido
      const mascota = this.mascotaForm.value; // Obtener valores del formulario

      console.log(JSON.stringify(mascota));
      mascota._id === null && delete mascota._id;
      console.log(JSON.stringify(mascota));

      if (this.mode === 'Nuevo') {
        this.mascotaService.create(mascota).subscribe({
          next: (data) => {
            console.log('Mascota guardado con éxito:', data);
            this.mascotas.push(data); // Agregar el nuevo mascota a la lista
            this.modalVisible = false; // Cerrar modal después de guardar
            this.loadMascotas(); // Recargar lista de mascotas
            this.mensajeConfirmacion(mascota,"Registro Actualizado");
          },
          error: (err) => {
            console.error('Error al guardar el mascota:', err);
          }
        });
      }else{
        this.mascotaService.update(mascota._id, mascota).subscribe(() => {
          this.modalVisible = false;
          this.loadMascotas();
          this.mensajeConfirmacion(mascota,"Registro Actualizado");
        });
      }
    }
  }

  onChangeEspecie(e: any) {
        this.mascotaForm.patchValue({especie_id:e.value});
       }
      onChangeRaza(e: any) {
        this.mascotaForm.patchValue({raza_id:e.value});
       }
      onChangeSexo(e: any) {
        this.mascotaForm.patchValue({sexo_id:e.value});
       }
      onChangeCliente(e: any) {
        this.mascotaForm.patchValue({cliente_id:e.value});
       }

  mensajeConfirmacion(mascota: Mascota,mensaje:String){
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: ` Mascota "${mascota.nombre}" ${mensaje}`
    });
  }



}
