import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VentaService } from '../../services/venta.service';
import { ClienteService } from '../../../clientes/services/cliente.service';
import { UsuarioService } from '../../../usuarios/services/usuario.service';
import { ProductoService } from '../../../productos/services/producto.service';
import { Venta } from '../../interfaces/venta.interface';
import { Cliente } from '../../../clientes/interfaces/cliente.interface';
import { Usuario } from '../../../usuarios/interfaces/usuario.interface';
import { Producto } from '../../../productos/interfaces/producto.interface';
@Component({
  selector: 'app-venta-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class VentaListComponent implements OnInit {
  ventas: Venta[] = [];
  filteredVentas: Venta[] = [];
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  clientes: Cliente[]= [];
  usuarios: Usuario[]= [];
  productos: Producto[]= [];
  selected_cliente:{ label: string; value: string }[]=[];
  selected_usuario:{ label: string; value: string }[]=[];
  selected_producto:{ label: string; value: string }[]=[];
  ventaForm: FormGroup;
  mode:string='';

  constructor(
  private fb: FormBuilder,
  private ventaService: VentaService,
  private confirmationService: ConfirmationService,
  private messageService: MessageService,
  private clienteService:ClienteService,
  private usuarioService:UsuarioService,
  private productoService:ProductoService
  ) {
    this.ventaForm = this.fb.group({
      _id: [null],
      fecha: ['', Validators.required],
      total: ['', Validators.required],
      cliente_id: ['', Validators.required],
      usuario_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
     this.loadClientes();
     this.loadUsuarios();
     this.loadProductos();
     this.loadVentas();
  }

  loadVentas() {
    this.ventaService.getAll().subscribe({
      next: (data) => {
        this.ventas = data.map(venta=>({
          ...venta,
          cliente_nombre:this.clientes.find(cliente=>cliente._id==venta.cliente_id)?.nombres||'Sin Cliente',
          usuario_nombre:this.usuarios.find(usuario=>usuario._id==venta.usuario_id)?.nombre||'Sin Usuario'
        }));
        this.filteredVentas = [...this.ventas];
      },
      error: (err) => {
        console.error('Error al cargar Ventas:', err);
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
  loadProductos() {
    this.productoService.getAll().subscribe({
      next: (data) => {
        this.productos = data;
        this.selected_producto = this.productos.map(producto => ({
          label: producto.descripcion,
          value: producto._id
        }));
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      }
    });
  }

  applyGlobalFilter() {
    const filterValue = this.globalFilter.toLowerCase().trim();
    console.log('Filtrando:', filterValue);

    if (!filterValue) {
      this.filteredVentas = [...this.ventas];
      return;
    }

    this.filteredVentas = this.ventas.filter((venta) =>
        Object.values(venta).some(
            (value) =>
                value &&
                value.toString().toLowerCase().includes(filterValue)
        )
    );
  }

  openModal(mode: 'Nuevo' | 'Editar', venta?: Venta) {
    this.mode=mode;
    console.log(mode);
    this.modalTitle = `${mode} Venta`;
    this.modalVisible = true;

    if (mode === 'Editar' && venta) {
      this.ventaForm.patchValue({
       _id: venta._id,
      fecha: venta.fecha,
      total: venta.total,
      cliente_id: venta.cliente_id,
      usuario_id: venta.usuario_id
      });
    } else {
      this.ventaForm.reset();
    }
  }

  confirmarEliminacion(venta: Venta) {
    console.log("Clic en eliminar:", venta);
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el Venta: ${venta.fecha}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.deleteVenta(venta);
      }
    });
  }

deleteVenta(venta: Venta) {
    this.ventaService.delete(venta._id).subscribe({
      next: () => {
        this.loadVentas();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Venta "${venta.fecha}" eliminado correctamente`
        });
      },
      error: (err) => {
        console.error('Error al eliminar el venta:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo eliminar el venta "${venta.fecha}"`
        });
      }
    });
  }

  saveRegistro() {
    if (this.ventaForm.valid) { // Verifica que el formulario sea válido
      const venta = this.ventaForm.value; // Obtener valores del formulario

      console.log(JSON.stringify(venta));
      venta._id === null && delete venta._id;
      console.log(JSON.stringify(venta));

      if (this.mode === 'Nuevo') {
        this.ventaService.create(venta).subscribe({
          next: (data) => {
            console.log('Venta guardado con éxito:', data);
            this.ventas.push(data); // Agregar el nuevo venta a la lista
            this.modalVisible = false; // Cerrar modal después de guardar
            this.loadVentas(); // Recargar lista de ventas
            this.mensajeConfirmacion(venta,"Registro Actualizado");
          },
          error: (err) => {
            console.error('Error al guardar el venta:', err);
          }
        });
      }else{
        this.ventaService.update(venta._id, venta).subscribe(() => {
          this.modalVisible = false;
          this.loadVentas();
          this.mensajeConfirmacion(venta,"Registro Actualizado");
        });
      }
    }
  }

  onChangeCliente(e: any) {
     this.ventaForm.patchValue({cliente_id:e.value});
  }
  onChangeUsuario(e: any) {
     this.ventaForm.patchValue({usuario_id:e.value});
  }
  onChangeProducto(e: any) {
    this.ventaForm.patchValue({producto_id:e.value});
  }
  mensajeConfirmacion(venta: Venta,mensaje:String){
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: ` Venta "${venta.fecha}" ${mensaje}`
    });
  }
  calcularTotal() {
    var total = this.ventaForm.value.cantidad*this.ventaForm.value.precio;
    this.ventaForm.patchValue({total:total});
    console.log("total : "+total);
  }


}
