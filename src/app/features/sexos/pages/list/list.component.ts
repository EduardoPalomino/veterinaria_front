import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SexoService } from '../../services/sexo.service';

import { Sexo } from '../../interfaces/sexo.interface';


@Component({
  selector: 'app-sexo-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class SexoListComponent implements OnInit {
  sexos: Sexo[] = [];
  filteredSexos: Sexo[] = [];
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  
  
  sexoForm: FormGroup;
  mode:string='';

  constructor(
  private fb: FormBuilder,
  private sexoService: SexoService,
  private confirmationService: ConfirmationService,
  private messageService: MessageService
  
  ) {
    this.sexoForm = this.fb.group({
      _id: [null],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
     
    this.loadSexos();
  }

  loadSexos() {
    this.sexoService.getAll().subscribe({
      next: (data) => {
        this.sexos = data.map(sexo=>({
          ...sexo,
          
        }));
        this.filteredSexos = [...this.sexos];
      },
      error: (err) => {
        console.error('Error al cargar Sexos:', err);
      }
    });
  }



  applyGlobalFilter() {
    const filterValue = this.globalFilter.toLowerCase().trim();
    console.log('Filtrando:', filterValue);

    if (!filterValue) {
      this.filteredSexos = [...this.sexos];
      return;
    }

    this.filteredSexos = this.sexos.filter((sexo) =>
        Object.values(sexo).some(
            (value) =>
                value &&
                value.toString().toLowerCase().includes(filterValue)
        )
    );
  }

  openModal(mode: 'Nuevo' | 'Editar', sexo?: Sexo) {
    this.mode=mode;
    console.log(mode);
    this.modalTitle = `${mode} Sexo`;
    this.modalVisible = true;

    if (mode === 'Editar' && sexo) {
      this.sexoForm.patchValue({
       _id: sexo._id,
      descripcion: sexo.descripcion
      });
    } else {
      this.sexoForm.reset();
    }
  }

  confirmarEliminacion(sexo: Sexo) {
    console.log("Clic en eliminar:", sexo);
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el Sexo: ${sexo.descripcion}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.deleteSexo(sexo);
      }
    });
  }

deleteSexo(sexo: Sexo) {
    this.sexoService.delete(sexo._id).subscribe({
      next: () => {
        this.loadSexos();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Sexo "${sexo.descripcion}" eliminado correctamente`
        });
      },
      error: (err) => {
        console.error('Error al eliminar el sexo:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo eliminar el sexo "${sexo.descripcion}"`
        });
      }
    });
  }

  saveRegistro() {
    if (this.sexoForm.valid) { // Verifica que el formulario sea válido
      const sexo = this.sexoForm.value; // Obtener valores del formulario

      console.log(JSON.stringify(sexo));
      sexo._id === null && delete sexo._id;
      console.log(JSON.stringify(sexo));

      if (this.mode === 'Nuevo') {
        this.sexoService.create(sexo).subscribe({
          next: (data) => {
            console.log('Sexo guardado con éxito:', data);
            this.sexos.push(data); // Agregar el nuevo sexo a la lista
            this.modalVisible = false; // Cerrar modal después de guardar
            this.loadSexos(); // Recargar lista de sexos
            this.mensajeConfirmacion(sexo,"Registro Actualizado");
          },
          error: (err) => {
            console.error('Error al guardar el sexo:', err);
          }
        });
      }else{
        this.sexoService.update(sexo._id, sexo).subscribe(() => {
          this.modalVisible = false;
          this.loadSexos();
          this.mensajeConfirmacion(sexo,"Registro Actualizado");
        });
      }
    }
  }

  

  mensajeConfirmacion(sexo: Sexo,mensaje:String){
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: ` Sexo "${sexo.descripcion}" ${mensaje}`
    });
  }



}
