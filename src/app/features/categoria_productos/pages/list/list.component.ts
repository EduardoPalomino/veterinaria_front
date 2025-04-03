import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria_productoService } from '../../services/categoria_producto.service';

import { Categoria_producto } from '../../interfaces/categoria_producto.interface';


@Component({
  selector: 'app-categoria_producto-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class Categoria_productoListComponent implements OnInit {
  categoria_productos: Categoria_producto[] = [];
  filteredCategoria_productos: Categoria_producto[] = [];
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  
  
  categoria_productoForm: FormGroup;
  mode:string='';

  constructor(
  private fb: FormBuilder,
  private categoria_productoService: Categoria_productoService,
  private confirmationService: ConfirmationService,
  private messageService: MessageService
  
  ) {
    this.categoria_productoForm = this.fb.group({
      _id: [null],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
     
    this.loadCategoria_productos();
  }

  loadCategoria_productos() {
    this.categoria_productoService.getAll().subscribe({
      next: (data) => {
        this.categoria_productos = data.map(categoria_producto=>({
          ...categoria_producto,
          
        }));
        this.filteredCategoria_productos = [...this.categoria_productos];
      },
      error: (err) => {
        console.error('Error al cargar Categoria_productos:', err);
      }
    });
  }



  applyGlobalFilter() {
    const filterValue = this.globalFilter.toLowerCase().trim();
    console.log('Filtrando:', filterValue);

    if (!filterValue) {
      this.filteredCategoria_productos = [...this.categoria_productos];
      return;
    }

    this.filteredCategoria_productos = this.categoria_productos.filter((categoria_producto) =>
        Object.values(categoria_producto).some(
            (value) =>
                value &&
                value.toString().toLowerCase().includes(filterValue)
        )
    );
  }

  openModal(mode: 'Nuevo' | 'Editar', categoria_producto?: Categoria_producto) {
    this.mode=mode;
    console.log(mode);
    this.modalTitle = `${mode} Categoria_producto`;
    this.modalVisible = true;

    if (mode === 'Editar' && categoria_producto) {
      this.categoria_productoForm.patchValue({
       _id: categoria_producto._id,
      nombre: categoria_producto.nombre,
      descripcion: categoria_producto.descripcion
      });
    } else {
      this.categoria_productoForm.reset();
    }
  }

  confirmarEliminacion(categoria_producto: Categoria_producto) {
    console.log("Clic en eliminar:", categoria_producto);
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el Categoria_producto: ${categoria_producto.nombre}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.deleteCategoria_producto(categoria_producto);
      }
    });
  }

deleteCategoria_producto(categoria_producto: Categoria_producto) {
    this.categoria_productoService.delete(categoria_producto._id).subscribe({
      next: () => {
        this.loadCategoria_productos();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Categoria_producto "${categoria_producto.nombre}" eliminado correctamente`
        });
      },
      error: (err) => {
        console.error('Error al eliminar el categoria_producto:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo eliminar el categoria_producto "${categoria_producto.nombre}"`
        });
      }
    });
  }

  saveRegistro() {
    if (this.categoria_productoForm.valid) { // Verifica que el formulario sea válido
      const categoria_producto = this.categoria_productoForm.value; // Obtener valores del formulario

      console.log(JSON.stringify(categoria_producto));
      categoria_producto._id === null && delete categoria_producto._id;
      console.log(JSON.stringify(categoria_producto));

      if (this.mode === 'Nuevo') {
        this.categoria_productoService.create(categoria_producto).subscribe({
          next: (data) => {
            console.log('Categoria_producto guardado con éxito:', data);
            this.categoria_productos.push(data); // Agregar el nuevo categoria_producto a la lista
            this.modalVisible = false; // Cerrar modal después de guardar
            this.loadCategoria_productos(); // Recargar lista de categoria_productos
            this.mensajeConfirmacion(categoria_producto,"Registro Actualizado");
          },
          error: (err) => {
            console.error('Error al guardar el categoria_producto:', err);
          }
        });
      }else{
        this.categoria_productoService.update(categoria_producto._id, categoria_producto).subscribe(() => {
          this.modalVisible = false;
          this.loadCategoria_productos();
          this.mensajeConfirmacion(categoria_producto,"Registro Actualizado");
        });
      }
    }
  }

  

  mensajeConfirmacion(categoria_producto: Categoria_producto,mensaje:String){
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: ` Categoria_producto "${categoria_producto.nombre}" ${mensaje}`
    });
  }



}
