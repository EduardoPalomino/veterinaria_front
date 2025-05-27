import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProveedorService } from '../../services/proveedor.service';

import { Proveedor } from '../../interfaces/proveedor.interface';


@Component({
  selector: 'app-proveedor-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class ProveedorListComponent implements OnInit {
  proveedors: Proveedor[] = [];
  filteredProveedors: Proveedor[] = [];
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  selected_proveedor: { label: string; value: string }[] = [];
  proveedorForm: FormGroup;
  mode:string='';
  proveedor:any= {
    _id:'',
    nombre: '',
    ruc:'',
    telefono: '',
    email: '',
    direccion: '',
    contacto:'',
    observaciones: ''
  }
  proveedorGrid: any = {
    _id: '',
    nombre:'',
    ruc:'',
    telefono: '',
    email: '',
    direccion: '',
    contacto: '',
    observaciones:''
  };
  constructor(
  private fb: FormBuilder,
  private proveedorService: ProveedorService,
  private confirmationService: ConfirmationService,
  private messageService: MessageService

  ) {
    this.proveedorForm = this.fb.group({
      _id: [null],
      nombre: ['', Validators.required],
      ruc: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', Validators.required],
      direccion: ['', Validators.required],
      contacto: ['', Validators.required],
      observaciones: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    this.loadProveedors();
  }

  loadProveedors() {
    this.proveedorService.getAll().subscribe({
      next: (data) => {
        this.proveedors = data.map(proveedor=>({
          ...proveedor,

        }));
        this.filteredProveedors = [...this.proveedors];

        this.selected_proveedor = data.map(p => ({
          label: p.nombre,
          value: p._id
        }));

      },
      error: (err) => {
        console.error('Error al cargar Proveedors:', err);
      }
    });
  }



  applyGlobalFilter() {
    const filterValue = this.globalFilter.toLowerCase().trim();
    console.log('Filtrando:', filterValue);

    if (!filterValue) {
      this.filteredProveedors = [...this.proveedors];
      return;
    }

    this.filteredProveedors = this.proveedors.filter((proveedor) =>
        Object.values(proveedor).some(
            (value) =>
                value &&
                value.toString().toLowerCase().includes(filterValue)
        )
    );
  }

  openModal(mode: 'Nuevo' | 'Editar', proveedor?: Proveedor) {
    this.mode=mode;
    console.log(mode);
    this.modalTitle = `${mode} Proveedor`;
    this.modalVisible = true;

    if (mode === 'Editar' && proveedor) {
      this.proveedorForm.patchValue({
       _id: proveedor._id,
      nombre: proveedor.nombre,
      ruc: proveedor.ruc,
      telefono: proveedor.telefono,
      email: proveedor.email,
      direccion: proveedor.direccion,
      contacto: proveedor.contacto,
      observaciones: proveedor.observaciones
      });
    } else {
      this.proveedorForm.reset();
    }
  }

  confirmarEliminacion(proveedor: Proveedor) {
    console.log("Clic en eliminar:", proveedor);
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el Proveedor: ${proveedor.nombre}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.deleteProveedor(proveedor);
      }
    });
  }

deleteProveedor(proveedor: Proveedor) {
    this.proveedorService.delete(proveedor._id).subscribe({
      next: () => {
        this.loadProveedors();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Proveedor "${proveedor.nombre}" eliminado correctamente`
        });
      },
      error: (err) => {
        console.error('Error al eliminar el proveedor:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo eliminar el proveedor "${proveedor.nombre}"`
        });
      }
    });
  }

  saveRegistro() {
    if (this.proveedorForm.valid) { // Verifica que el formulario sea válido
      const proveedor = this.proveedorForm.value; // Obtener valores del formulario

      console.log(JSON.stringify(proveedor));
      proveedor._id === null && delete proveedor._id;
      console.log(JSON.stringify(proveedor));

      if (this.mode === 'Nuevo') {
        this.proveedorService.create(proveedor).subscribe({
          next: (data) => {
            console.log('Proveedor guardado con éxito:', data);
            this.proveedors.push(data); // Agregar el nuevo proveedor a la lista
            this.modalVisible = false; // Cerrar modal después de guardar
            this.loadProveedors(); // Recargar lista de proveedors
            this.mensajeConfirmacion(proveedor,"Registro Actualizado");
          },
          error: (err) => {
            console.error('Error al guardar el proveedor:', err);
          }
        });
      }else{
        this.proveedorService.update(proveedor._id, proveedor).subscribe(() => {
          this.modalVisible = false;
          this.loadProveedors();
          this.mensajeConfirmacion(proveedor,"Registro Actualizado");
        });
      }
    }
  }
  mensajeConfirmacion(proveedor: Proveedor,mensaje:String){
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: ` Proveedor "${proveedor.nombre}" ${mensaje}`
    });
  }

  onAddProveedorTGrid($event:any){
    let proveedor_id= $event.value.value;
    this.proveedor = this.findProveedor(proveedor_id);
    this.proveedorGrid = {
      _id: this.proveedor._id,
      nombre:this.proveedor.nombre,
      ruc:this.proveedor.ruc,
      telefono: this.proveedor.telefono,
      email: this.proveedor.email,
      direccion: this.proveedor.direccion,
      contacto: this.proveedor.contacto,
      observaciones:this.proveedor.observaciones
    }
    console.log(proveedor_id)
    console.log(JSON.stringify(this.proveedorGrid))
  }

  private findProveedor(proveedor_id: string): any{
    return this.proveedors.find(p => p._id === proveedor_id);
  }

}
