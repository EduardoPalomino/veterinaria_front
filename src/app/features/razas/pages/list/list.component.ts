import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RazaService } from '../../services/raza.service';
import { EspecieService } from '../../../especies/services/especie.service';
import { Raza } from '../../interfaces/raza.interface';
import { Especie } from '../../../especies/interfaces/especie.interface';

@Component({
  selector: 'app-raza-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class RazaListComponent implements OnInit {
  razas: Raza[] = [];
  filteredRazas: Raza[] = [];
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  especies: Especie[]= [];
  selected_especie:{ label: string; value: string }[]=[];
  razaForm: FormGroup;
  mode:string='';

  constructor(
  private fb: FormBuilder,
  private razaService: RazaService,
  private confirmationService: ConfirmationService,
  private messageService: MessageService,
  private especieService:EspecieService
  ) {
    this.razaForm = this.fb.group({
      _id: [null],
      descripcion: ['', Validators.required],
      especie_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
     this.loadEspecies();
    this.loadRazas();
  }

  loadRazas() {
    this.razaService.getAll().subscribe({
      next: (data) => {
        this.razas = data.map(raza=>({
          ...raza,
          especie_nombre:this.especies.find(especie=>especie._id==raza.especie_id)?.descripcion||'Sin Especie'
        }));
        this.filteredRazas = [...this.razas];
      },
      error: (err) => {
        console.error('Error al cargar Razas:', err);
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

  applyGlobalFilter() {
    const filterValue = this.globalFilter.toLowerCase().trim();
    console.log('Filtrando:', filterValue);

    if (!filterValue) {
      this.filteredRazas = [...this.razas];
      return;
    }

    this.filteredRazas = this.razas.filter((raza) =>
        Object.values(raza).some(
            (value) =>
                value &&
                value.toString().toLowerCase().includes(filterValue)
        )
    );
  }

  openModal(mode: 'Nuevo' | 'Editar', raza?: Raza) {
    this.mode=mode;
    console.log(mode);
    this.modalTitle = `${mode} Raza`;
    this.modalVisible = true;

    if (mode === 'Editar' && raza) {
      this.razaForm.patchValue({
       _id: raza._id,
      descripcion: raza.descripcion,
      especie_id: raza.especie_id
      });
    } else {
      this.razaForm.reset();
    }
  }

  confirmarEliminacion(raza: Raza) {
    console.log("Clic en eliminar:", raza);
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el Raza: ${raza.descripcion}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.deleteRaza(raza);
      }
    });
  }

deleteRaza(raza: Raza) {
    this.razaService.delete(raza._id).subscribe({
      next: () => {
        this.loadRazas();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Raza "${raza.descripcion}" eliminado correctamente`
        });
      },
      error: (err) => {
        console.error('Error al eliminar el raza:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo eliminar el raza "${raza.descripcion}"`
        });
      }
    });
  }

  saveRegistro() {
    if (this.razaForm.valid) { // Verifica que el formulario sea válido
      const raza = this.razaForm.value; // Obtener valores del formulario

      console.log(JSON.stringify(raza));
      raza._id === null && delete raza._id;
      console.log(JSON.stringify(raza));

      if (this.mode === 'Nuevo') {
        this.razaService.create(raza).subscribe({
          next: (data) => {
            console.log('Raza guardado con éxito:', data);
            this.razas.push(data); // Agregar el nuevo raza a la lista
            this.modalVisible = false; // Cerrar modal después de guardar
            this.loadRazas(); // Recargar lista de razas
            this.mensajeConfirmacion(raza,"Registro Actualizado");
          },
          error: (err) => {
            console.error('Error al guardar el raza:', err);
          }
        });
      }else{
        this.razaService.update(raza._id, raza).subscribe(() => {
          this.modalVisible = false;
          this.loadRazas();
          this.mensajeConfirmacion(raza,"Registro Actualizado");
        });
      }
    }
  }

  onChangeEspecie(e: any) {
        this.razaForm.patchValue({especie_id:e.value});
       }

  mensajeConfirmacion(raza: Raza,mensaje:String){
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: ` Raza "${raza.descripcion}" ${mensaje}`
    });
  }



}
