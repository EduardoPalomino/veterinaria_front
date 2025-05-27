import {Component, Input, OnInit} from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'moduleBoxLinks',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class Module_box_linkListComponent implements OnInit {
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  module_box_linkForm: FormGroup;
  mode:string='';
  @Input() title: string = '';
  grupoLink: { link: string; texto: string }[] = [];
  constructor(
  private fb: FormBuilder,
  private confirmationService: ConfirmationService,
  private messageService: MessageService

  ) {
    this.module_box_linkForm = this.fb.group({
      _id: [null],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.groupLinks();
  }
  groupLinks() {
    const cliente = [
      { link: 'admin/historia_clinicas', texto: 'Historia Clínica' },
      { link: 'admin/mascotas', texto: 'Mascotas' },
      { link: 'admin/clientes', texto: 'Datos Personales' }
    ];

    const producto = [
      { link: 'admin/ventas', texto: 'Generar Venta' },
      { link: 'admin/productos', texto: 'Stock Producto' }, // Cambiado para diferenciar
      { link: '', texto: '' }
    ];
    const venta = [
      { link: 'admin/ventas', texto: 'Historico Ventas' },
      { link: 'admin/productos', texto: 'Productos más vendidos' }, // Cambiado para diferenciar
      { link: '', texto: '' }
    ];
    const compra = [
      { link: 'admin/compras', texto: 'Historico Compras' },
      { link: 'admin/productos', texto: 'Productos más comprados' }, // Cambiado para diferenciar
      { link: '', texto: '' }
    ];
    const reporte = [
      { link: 'reporte', texto: 'Reporte' },
      { link: 'reporte', texto: 'Reporte 2' }, // Cambiado para diferenciar
      { link: 'reporte', texto: 'Reporte 3' }
    ];

    const inventario = [
      { link: 'reporte', texto: 'Reporte' },
      { link: 'reporte', texto: 'Reporte 2' }, // Cambiado para diferenciar
      { link: 'reporte', texto: 'Reporte 3' }
    ];
    switch(this.title) {
      case 'CLIENTES':
        this.grupoLink = cliente;
        break;
      case 'PRODUCTOS':
        this.grupoLink = producto;
        break;
      case 'VENTAS':
        this.grupoLink = venta;
        break;
      case 'COMPRAS':
        this.grupoLink = compra;
        break;
      case 'REPORTES':
        this.grupoLink = reporte;
        break;
      case 'INVENTARIOS':
        this.grupoLink = inventario;
        break;
      default:
        this.grupoLink = [];
    }
  }
}
