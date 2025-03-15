import { Component, OnInit} from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RolService } from '../../services/rol.service';
import { Rol } from '../../interfaces/rol.interface';


@Component({
  selector: 'app-rol-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class RolListComponent implements OnInit {
  rols: Rol[] = [];
  filteredRols: Rol[] = [];
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  rolForm: FormGroup;
  mode:string='';

  constructor(
    private fb: FormBuilder,
    private rolService: RolService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.rolForm = this.fb.group({
      _id: [null],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadRols();
  }

  loadRols() {
    this.rolService.getAll().subscribe({
      next: (data) => {
        this.rols = data;
        this.filteredRols = [...this.rols];
      },
      error: (err) => {
        console.error('Error al cargar Rols:', err);
      }
    });

  }

  applyGlobalFilter() {
    const filterValue = this.globalFilter.toLowerCase().trim();
    console.log('Filtrando:', filterValue);

    if (!filterValue) {
      //this.filteredRols = this.rols; // Si no hay filtro, mostrar todos
      this.filteredRols = [...this.rols];
      return;
    }

    this.filteredRols = this.rols.filter((rol) =>
        Object.values(rol).some(
            (value) =>
                value &&
                value.toString().toLowerCase().includes(filterValue)
        )
    );
  }

  openModal(mode: 'Nuevo' | 'Editar', rol?: Rol) {
    this.mode=mode;
    console.log(mode);
    this.modalTitle = `${mode} Rol`;
    this.modalVisible = true;
    if (mode === 'Editar' && rol) {
      this.rolForm.patchValue(rol);
    } else {
      this.rolForm.reset();
    }
  }

  saveRol() {
    if (this.rolForm.valid) {
      const rol = this.rolForm.value;

      if (rol._id) {
        // Editar Rol en el backend
        this.rolService.update(rol._id, rol).subscribe(() => {
          this.loadRols(); // Recargar lista después de editar
        });
      } else {
        // Crear Rol en el backend
        this.rolService.create(rol).subscribe(() => {
          this.loadRols(); // Recargar lista después de crear
        });
      }

      this.modalVisible = false;
    }
  }

  confirmarEliminacion(rol: Rol) {
    console.log("Clic en eliminar:", rol);
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el Rol: ${rol.descripcion}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.deleteRol(rol);
      }
    });
  }
  /*deleteRol(rol: Rol) {
    this.rolService.delete(rol._id).subscribe({
      next: () => {
        this.loadRols();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Rol eliminado correctamente' });
      },
      error: (err) => {
        console.error('Error al eliminar el rol:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el rol' });
      }
    });
  }*/

  deleteRol(rol: Rol) {
    this.rolService.delete(rol._id).subscribe({
      next: () => {
        this.loadRols();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Rol "${rol.descripcion}" eliminado correctamente`
        });
      },
      error: (err) => {
        console.error('Error al eliminar el rol:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo eliminar el rol "${rol.descripcion}"`
        });
      }
    });
  }

  saveRegistro() {
    if (this.rolForm.valid) { // Verifica que el formulario sea válido
      const rol = this.rolForm.value; // Obtener valores del formulario

      console.log(JSON.stringify(rol));
      rol._id === null && delete rol._id;
      console.log(JSON.stringify(rol));

      if (this.mode === 'Nuevo') {
        this.rolService.create(rol).subscribe({
          next: (data) => {
            console.log('Rol guardado con éxito:', data);
            this.rols.push(data); // Agregar el nuevo rol a la lista
            this.modalVisible = false; // Cerrar modal después de guardar
            this.loadRols(); // Recargar lista de roles
          },
          error: (err) => {
            console.error('Error al guardar el rol:', err);
          }
        });
      }else{
        this.rolService.update(rol._id, rol).subscribe(() => {
          this.modalVisible = false;
          this.loadRols();
        });
      }
    }
  }


}
