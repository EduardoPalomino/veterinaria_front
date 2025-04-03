import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Detalle_compraService } from '../../services/detalle_compra.service';
import { CompraService } from '../../../compras/services/compra.service';
import { ProductoService } from '../../../productos/services/producto.service';
import { Detalle_compra } from '../../interfaces/detalle_compra.interface';
import { Compra } from '../../../compras/interfaces/compra.interface';
import { Producto } from '../../../productos/interfaces/producto.interface';

@Component({
  selector: 'app-detalle_compra-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class Detalle_compraListComponent implements OnInit {
  detalle_compras: Detalle_compra[] = [];
  filteredDetalle_compras: Detalle_compra[] = [];
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  compras: Compra[]= [];
  productos: Producto[]= [];
  selected_compra:{ label: string; value: string }[]=[];
  selected_producto:{ label: string; value: string }[]=[];
  detalle_compraForm: FormGroup;
  mode:string='';

  constructor(
  private fb: FormBuilder,
  private detalle_compraService: Detalle_compraService,
  private confirmationService: ConfirmationService,
  private messageService: MessageService,
  private compraService:CompraService,
  private productoService:ProductoService
  ) {
    this.detalle_compraForm = this.fb.group({
      _id: [null],
      compra_id: ['', Validators.required],
      producto_id: ['', Validators.required],
      cantidad: ['', Validators.required],
      precio_compra: ['', Validators.required]
    });
  }

  ngOnInit(): void {
     this.loadCompras();
     this.loadProductos();
    this.loadDetalle_compras();
  }

  loadDetalle_compras() {
    this.detalle_compraService.getAll().subscribe({
      next: (data) => {
        this.detalle_compras = data.map(detalle_compra=>({
          ...detalle_compra,
          compra_nombre:this.compras.find(compra=>compra._id==detalle_compra.compra_id)?._id||'Sin Compra',
          producto_nombre:this.productos.find(producto=>producto._id==detalle_compra.producto_id)?.descripcion||'Sin Producto'
        }));
        this.filteredDetalle_compras = [...this.detalle_compras];
      },
      error: (err) => {
        console.error('Error al cargar Detalle_compras:', err);
      }
    });
  }

loadCompras() {
    this.compraService.getAll().subscribe({
      next: (data) => {
        this.compras = data;
        this.selected_compra = this.compras.map(compra => ({
          label: compra._id,
          value: compra._id
        }));
      },
      error: (err) => {
        console.error('Error al cargar compras:', err);
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
      this.filteredDetalle_compras = [...this.detalle_compras];
      return;
    }

    this.filteredDetalle_compras = this.detalle_compras.filter((detalle_compra) =>
        Object.values(detalle_compra).some(
            (value) =>
                value &&
                value.toString().toLowerCase().includes(filterValue)
        )
    );
  }

  openModal(mode: 'Nuevo' | 'Editar', detalle_compra?: Detalle_compra) {
    this.mode=mode;
    console.log(mode);
    this.modalTitle = `${mode} Detalle_compra`;
    this.modalVisible = true;

    if (mode === 'Editar' && detalle_compra) {
      this.detalle_compraForm.patchValue({
       _id: detalle_compra._id,
      compra_id: detalle_compra.compra_id,
      producto_id: detalle_compra.producto_id,
      cantidad: detalle_compra.cantidad,
      precio_compra: detalle_compra.precio_compra
      });
    } else {
      this.detalle_compraForm.reset();
    }
  }

  confirmarEliminacion(detalle_compra: Detalle_compra) {
    console.log("Clic en eliminar:", detalle_compra);
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el Detalle_compra: ${detalle_compra.compra_id}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.deleteDetalle_compra(detalle_compra);
      }
    });
  }

deleteDetalle_compra(detalle_compra: Detalle_compra) {
    this.detalle_compraService.delete(detalle_compra._id).subscribe({
      next: () => {
        this.loadDetalle_compras();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Detalle_compra "${detalle_compra.compra_id}" eliminado correctamente`
        });
      },
      error: (err) => {
        console.error('Error al eliminar el detalle_compra:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo eliminar el detalle_compra "${detalle_compra.compra_id}"`
        });
      }
    });
  }

  saveRegistro() {
    if (this.detalle_compraForm.valid) { // Verifica que el formulario sea válido
      const detalle_compra = this.detalle_compraForm.value; // Obtener valores del formulario

      console.log(JSON.stringify(detalle_compra));
      detalle_compra._id === null && delete detalle_compra._id;
      console.log(JSON.stringify(detalle_compra));

      if (this.mode === 'Nuevo') {
        this.detalle_compraService.create(detalle_compra).subscribe({
          next: (data) => {
            console.log('Detalle_compra guardado con éxito:', data);
            this.detalle_compras.push(data); // Agregar el nuevo detalle_compra a la lista
            this.modalVisible = false; // Cerrar modal después de guardar
            this.loadDetalle_compras(); // Recargar lista de detalle_compras
            this.mensajeConfirmacion(detalle_compra,"Registro Actualizado");
          },
          error: (err) => {
            console.error('Error al guardar el detalle_compra:', err);
          }
        });
      }else{
        this.detalle_compraService.update(detalle_compra._id, detalle_compra).subscribe(() => {
          this.modalVisible = false;
          this.loadDetalle_compras();
          this.mensajeConfirmacion(detalle_compra,"Registro Actualizado");
        });
      }
    }
  }

  onChangeCompra(e: any) {
    this.detalle_compraForm.patchValue({compra_id:e.value});
  }
  onChangeProducto(e: any) {
    this.detalle_compraForm.patchValue({producto_id:e.value});
  }

  mensajeConfirmacion(detalle_compra: Detalle_compra,mensaje:String){
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: ` Detalle_compra "${detalle_compra.compra_id}" ${mensaje}`
    });
  }



}
