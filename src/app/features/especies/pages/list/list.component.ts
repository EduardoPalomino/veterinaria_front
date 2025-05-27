import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EspecieService } from '../../services/especie.service';

import { Especie } from '../../interfaces/especie.interface';


@Component({
  selector: 'app-especie-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class EspecieListComponent implements OnInit {
  especies: Especie[] = [];
  filteredEspecies: Especie[] = [];
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';


  especieForm: FormGroup;
  mode:string='';

  constructor(
  private fb: FormBuilder,
  private especieService: EspecieService,
  private confirmationService: ConfirmationService,
  private messageService: MessageService

  ) {
    this.especieForm = this.fb.group({
      _id: [null],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    this.loadEspecies();
  }

  loadEspecies() {
    this.especieService.getAll().subscribe({
      next: (data) => {
        this.especies = data;
      },
      error: (err) => {
        console.error('Error al cargar Especies:', err);
      }
    });
  }



  applyGlobalFilter() {
    const filterValue = this.globalFilter.toLowerCase().trim();
    console.log('Filtrando:', filterValue);

    if (!filterValue) {
      this.filteredEspecies = [...this.especies];
      return;
    }

    this.filteredEspecies = this.especies.filter((especie) =>
        Object.values(especie).some(
            (value) =>
                value &&
                value.toString().toLowerCase().includes(filterValue)
        )
    );
  }

  openModal(mode: 'Nuevo' | 'Editar', especie?: Especie) {
    this.mode=mode;
    console.log(mode);
    this.modalTitle = `${mode} Especie`;
    this.modalVisible = true;

    if (mode === 'Editar' && especie) {
      this.especieForm.patchValue({
       _id: especie._id,
      descripcion: especie.descripcion
      });
    } else {
      this.especieForm.reset();
    }
  }

  confirmarEliminacion(especie: Especie) {
    console.log("Clic en eliminar:", especie);
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el Especie: ${especie.descripcion}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.deleteEspecie(especie);
      }
    });
  }

deleteEspecie(especie: Especie) {
    this.especieService.delete(especie._id).subscribe({
      next: () => {
        this.loadEspecies();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Especie "${especie.descripcion}" eliminado correctamente`
        });
      },
      error: (err) => {
        console.error('Error al eliminar el especie:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo eliminar el especie "${especie.descripcion}"`
        });
      }
    });
  }

  saveRegistro() {
    if (this.especieForm.valid) { // Verifica que el formulario sea válido
      const especie = this.especieForm.value; // Obtener valores del formulario

      console.log(JSON.stringify(especie));
      especie._id === null && delete especie._id;
      console.log(JSON.stringify(especie));

      if (this.mode === 'Nuevo') {
        this.especieService.create(especie).subscribe({
          next: (data) => {
            console.log('Especie guardado con éxito:', data);
            this.especies.push(data); // Agregar el nuevo especie a la lista
            this.modalVisible = false; // Cerrar modal después de guardar
            this.loadEspecies(); // Recargar lista de especies
            this.mensajeConfirmacion(especie,"Registro Actualizado");
          },
          error: (err) => {
            console.error('Error al guardar el especie:', err);
          }
        });
      }else{
        this.especieService.update(especie._id, especie).subscribe(() => {
          this.modalVisible = false;
          this.loadEspecies();
          this.mensajeConfirmacion(especie,"Registro Actualizado");
        });
      }
    }
  }



  mensajeConfirmacion(especie: Especie,mensaje:String){
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: ` Especie "${especie.descripcion}" ${mensaje}`
    });
  }



}
