import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Detalle_ventaService } from '../../services/detalle_venta.service';
import { VentaService } from '../../../ventas/services/venta.service';
import { ProductoService } from '../../../productos/services/producto.service';
import { Detalle_venta } from '../../interfaces/detalle_venta.interface';
import { Venta } from '../../../ventas/interfaces/venta.interface';
import { Producto } from '../../../productos/interfaces/producto.interface';

@Component({
  selector: 'app-detalle_venta-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class Detalle_ventaListComponent implements OnInit {
  detalle_ventas: Detalle_venta[] = [];
  filteredDetalle_ventas: Detalle_venta[] = [];
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  ventas: Venta[]= [];
  productos: Producto[]= [];
  selected_venta:{ label: string; value: string }[]=[];
  selected_producto:{ label: string; value: string }[]=[];
  detalle_ventaForm: FormGroup;
  mode:string='';

  constructor(
  private fb: FormBuilder,
  private detalle_ventaService: Detalle_ventaService,
  private confirmationService: ConfirmationService,
  private messageService: MessageService,
  private ventaService:VentaService,
  private productoService:ProductoService
  ) {
    this.detalle_ventaForm = this.fb.group({
      _id: [null],
      venta_id: ['', Validators.required],
      producto_id: ['', Validators.required],
      cantidad: ['', Validators.required],
      precio_venta: ['', Validators.required]
    });
  }

  ngOnInit(): void {
     this.loadVentas();
    this.loadProductos();
    this.loadDetalle_ventas();
  }

  loadDetalle_ventas() {
    this.detalle_ventaService.getAll().subscribe({
      next: (data) => {
        this.detalle_ventas = data.map(detalle_venta=>({
          ...detalle_venta,
          venta_nombre:this.ventas.find(venta=>venta._id==detalle_venta.venta_id)?._id||'Sin Venta',
          producto_nombre:this.productos.find(producto=>producto._id==detalle_venta.producto_id)?.descripcion||'Sin Producto'
        }));
        this.filteredDetalle_ventas = [...this.detalle_ventas];
      },
      error: (err) => {
        console.error('Error al cargar Detalle_ventas:', err);
      }
    });
  }

loadVentas() {
    this.ventaService.getAll().subscribe({
      next: (data) => {
        this.ventas = data;
        this.selected_venta = this.ventas.map(venta => ({
          label: venta._id,
          value: venta._id
        }));
      },
      error: (err) => {
        console.error('Error al cargar ventas:', err);
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
      this.filteredDetalle_ventas = [...this.detalle_ventas];
      return;
    }

    this.filteredDetalle_ventas = this.detalle_ventas.filter((detalle_venta) =>
        Object.values(detalle_venta).some(
            (value) =>
                value &&
                value.toString().toLowerCase().includes(filterValue)
        )
    );
  }

  openModal(mode: 'Nuevo' | 'Editar', detalle_venta?: Detalle_venta) {
    this.mode=mode;
    console.log(mode);
    this.modalTitle = `${mode} Detalle_venta`;
    this.modalVisible = true;

    if (mode === 'Editar' && detalle_venta) {
      this.detalle_ventaForm.patchValue({
       _id: detalle_venta._id,
      venta_id: detalle_venta.venta_id,
      producto_id: detalle_venta.producto_id,
      cantidad: detalle_venta.cantidad,
      precio_venta: detalle_venta.precio_venta
      });
    } else {
      this.detalle_ventaForm.reset();
    }
  }

  confirmarEliminacion(detalle_venta: Detalle_venta) {
    console.log("Clic en eliminar:", detalle_venta);
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el Detalle_venta: ${detalle_venta.venta_id}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.deleteDetalle_venta(detalle_venta);
      }
    });
  }

deleteDetalle_venta(detalle_venta: Detalle_venta) {
    this.detalle_ventaService.delete(detalle_venta._id).subscribe({
      next: () => {
        this.loadDetalle_ventas();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Detalle_venta "${detalle_venta.venta_id}" eliminado correctamente`
        });
      },
      error: (err) => {
        console.error('Error al eliminar el detalle_venta:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo eliminar el detalle_venta "${detalle_venta.venta_id}"`
        });
      }
    });
  }

  saveRegistro() {
    if (this.detalle_ventaForm.valid) { // Verifica que el formulario sea válido
      const detalle_venta = this.detalle_ventaForm.value; // Obtener valores del formulario

      console.log(JSON.stringify(detalle_venta));
      detalle_venta._id === null && delete detalle_venta._id;
      console.log(JSON.stringify(detalle_venta));

      if (this.mode === 'Nuevo') {
        this.detalle_ventaService.create(detalle_venta).subscribe({
          next: (data) => {
            console.log('Detalle_venta guardado con éxito:', data);
            this.detalle_ventas.push(data); // Agregar el nuevo detalle_venta a la lista
            this.modalVisible = false; // Cerrar modal después de guardar
            this.loadDetalle_ventas(); // Recargar lista de detalle_ventas
            this.mensajeConfirmacion(detalle_venta,"Registro Actualizado");
          },
          error: (err) => {
            console.error('Error al guardar el detalle_venta:', err);
          }
        });
      }else{
        this.detalle_ventaService.update(detalle_venta._id, detalle_venta).subscribe(() => {
          this.modalVisible = false;
          this.loadDetalle_ventas();
          this.mensajeConfirmacion(detalle_venta,"Registro Actualizado");
        });
      }
    }
  }

  onChangeVenta(e: any) {
        this.detalle_ventaForm.patchValue({venta_id:e.value});
       }
      onChangeProducto(e: any) {
        this.detalle_ventaForm.patchValue({producto_id:e.value});
       }

  mensajeConfirmacion(detalle_venta: Detalle_venta,mensaje:String){
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: ` Detalle_venta "${detalle_venta.venta_id}" ${mensaje}`
    });
  }



}
