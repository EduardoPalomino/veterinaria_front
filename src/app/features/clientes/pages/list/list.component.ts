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
  cliente:Cliente={
    _id:'',
    nombres:'',
    apellidos:'',
    dni:'',
    telefono:'',
    direccion:'',
    email:'',
    indicacion_general:'',
    created_at:'',
    updated_at:''
  }
  clienteGrid: any = {
    _id:'',
    nombres: '',
    apellidos: '',
    dni: '',
    telefono: '',
    direccion: '',
    email: '',
    indicacion_general: ''
  };
  filteredClientes: Cliente[] = [];
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  mode: string = '';
  clienteForm: FormGroup;
  selected_cliente: { label: string; value: string }[] = [];
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

  private loadClientes(): void {
    this.clienteService.getAll().subscribe({
      next: (data) => {
        this.clientes = data;
        this.filteredClientes = [...this.clientes];
        this.selected_cliente = data.map(c => ({
          label: c.nombres,
          value: c._id
        }));
      },
      error: (err) => this.handleError('Error al cargar clientes:', err)
    });
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message
    });
  }

  private showSuccessMessage(cliente: Cliente, mensaje: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: `Cliente "${cliente.nombres}" ${mensaje}`
    });
  }

  applyGlobalFilter(): void {
    const filterValue = this.globalFilter.toLowerCase().trim();

    if (!filterValue) {
      this.filteredClientes = [...this.clientes];
      return;
    }

    this.filteredClientes = this.clientes.filter(cliente =>
      Object.values(cliente).some(
        value => value && value.toString().toLowerCase().includes(filterValue)
      ));
  }

  openModal(mode: 'Nuevo' | 'Editar', cliente?: Cliente): void {
    this.mode = mode;
    this.modalTitle = `${mode} Cliente`;
    this.modalVisible = true;
    console.log('-----MODO-----: '+this.mode);
    console.log('-----CLIENTE-----: '+JSON.stringify(cliente,null,2));
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

  confirmarEliminacion(cliente: Cliente): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el Cliente: ${cliente.nombres}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => this.deleteCliente(cliente)
    });
  }

  deleteCliente(cliente: Cliente): void {
    this.clienteService.delete(cliente._id).subscribe({
      next: () => {
        this.loadClientes();
        this.showSuccessMessage(cliente, "eliminado correctamente");
      },
      error: (err) => this.handleError(`No se pudo eliminar el cliente "${cliente.nombres}"`, err)
    });
  }

  saveRegistro(): void {
    if (this.clienteForm.valid) {
      const cliente = this.clienteForm.value;
      if (this.mode === 'Nuevo') {
        delete cliente._id;
        this.createCliente(cliente);
      } else {
        this.updateCliente(cliente);
      }
    }
  }

  private createCliente(cliente: Cliente): void {
    this.clienteService.create(cliente).subscribe({
      next: (data) => {
        this.clientes.push(data);
        this.modalVisible = false;
        this.loadClientes();
        this.showSuccessMessage(cliente, "creado correctamente");
      },
      error: (err) => this.handleError('Error al crear el cliente:', err)
    });
  }

  private updateCliente(cliente: Cliente): void {
    this.clienteService.update(cliente._id, cliente).subscribe({
      next: () => {
        this.modalVisible = false;
        this.loadClientes();
        this.showSuccessMessage(cliente, "actualizado correctamente");
      },
      error: (err) => this.handleError('Error al actualizar el cliente:', err)
    });
  }

  onAddClienteTGrid($event:any){
    let cliente_id= $event.value.value;
    this.cliente = this.findCliente(cliente_id);
    this.clienteGrid = {
      _id:this.cliente._id,
      nombres: this.cliente.nombres,
      apellidos: this.cliente.apellidos,
      dni:this.cliente.dni,
      telefono:this.cliente.telefono,
      direccion:this.cliente.direccion,
      email:this.cliente.email,
      indicacion_general:this.cliente.indicacion_general
    }
    console.log(cliente_id)
    console.log(JSON.stringify(this.clienteGrid))
  }

  private findCliente(cliente_id: string): any{
    return this.clientes.find(c => c._id === cliente_id);
  }

}
