import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';

import { Cliente } from '../../interfaces/cliente.interface';


@Component({
  selector: 'app-cliente-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class ClienteListComponent implements OnInit {
  clientes: Cliente[] = [];
  filteredClientes: Cliente[] = [];
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  
  
  clienteForm: FormGroup;
  mode:string='';

  constructor(
  private fb: FormBuilder,
  private clienteService: ClienteService,
  private confirmationService: ConfirmationService,
  private messageService: MessageService
  
  ) {
    this.clienteForm = this.fb.group({
      _id: [null],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      dni: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      email: ['', Validators.required],
      indicacion_general: ['', Validators.required]
    });
  }

  ngOnInit(): void {
     
    this.loadClientes();
  }

  loadClientes() {
    this.clienteService.getAll().subscribe({
      next: (data) => {
        this.clientes = data.map(cliente=>({
          ...cliente,
          
        }));
        this.filteredClientes = [...this.clientes];
      },
      error: (err) => {
        console.error('Error al cargar Clientes:', err);
      }
    });
  }



  applyGlobalFilter() {
    const filterValue = this.globalFilter.toLowerCase().trim();
    console.log('Filtrando:', filterValue);

    if (!filterValue) {
      this.filteredClientes = [...this.clientes];
      return;
    }

    this.filteredClientes = this.clientes.filter((cliente) =>
        Object.values(cliente).some(
            (value) =>
                value &&
                value.toString().toLowerCase().includes(filterValue)
        )
    );
  }

  openModal(mode: 'Nuevo' | 'Editar', cliente?: Cliente) {
    this.mode=mode;
    console.log(mode);
    this.modalTitle = `${mode} Cliente`;
    this.modalVisible = true;

    if (mode === 'Editar' && cliente) {
      this.clienteForm.patchValue({
       _id: cliente._id,
      nombres: cliente.nombres,
      apellidos: cliente.apellidos,
      dni: cliente.dni,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
      email: cliente.email,
      indicacion_general: cliente.indicacion_general
      });
    } else {
      this.clienteForm.reset();
    }
  }

  confirmarEliminacion(cliente: Cliente) {
    console.log("Clic en eliminar:", cliente);
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el Cliente: ${cliente.nombres}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.deleteCliente(cliente);
      }
    });
  }

deleteCliente(cliente: Cliente) {
    this.clienteService.delete(cliente._id).subscribe({
      next: () => {
        this.loadClientes();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Cliente "${cliente.nombres}" eliminado correctamente`
        });
      },
      error: (err) => {
        console.error('Error al eliminar el cliente:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo eliminar el cliente "${cliente.nombres}"`
        });
      }
    });
  }

  saveRegistro() {
    if (this.clienteForm.valid) { // Verifica que el formulario sea válido
      const cliente = this.clienteForm.value; // Obtener valores del formulario

      console.log(JSON.stringify(cliente));
      cliente._id === null && delete cliente._id;
      console.log(JSON.stringify(cliente));

      if (this.mode === 'Nuevo') {
        this.clienteService.create(cliente).subscribe({
          next: (data) => {
            console.log('Cliente guardado con éxito:', data);
            this.clientes.push(data); // Agregar el nuevo cliente a la lista
            this.modalVisible = false; // Cerrar modal después de guardar
            this.loadClientes(); // Recargar lista de clientes
            this.mensajeConfirmacion(cliente,"Registro Actualizado");
          },
          error: (err) => {
            console.error('Error al guardar el cliente:', err);
          }
        });
      }else{
        this.clienteService.update(cliente._id, cliente).subscribe(() => {
          this.modalVisible = false;
          this.loadClientes();
          this.mensajeConfirmacion(cliente,"Registro Actualizado");
        });
      }
    }
  }

  

  mensajeConfirmacion(cliente: Cliente,mensaje:String){
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: ` Cliente "${cliente.nombres}" ${mensaje}`
    });
  }

}
