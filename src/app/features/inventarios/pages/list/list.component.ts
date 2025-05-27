import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';





@Component({
  selector: 'app-inventario-list',
  templateUrl: './list.component.html',
})
export class InventarioListComponent implements OnInit {
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  mode: string = '';

  // Añade esto:
  filtroForm: FormGroup;

  selected_categoria: { label: string; value: string }[] = [];
  itemsCompra: any = [];

  constructor(private fb: FormBuilder) {
    // Inicializa el FormGroup
    this.filtroForm = this.fb.group({
      busqueda_categoria: [null],
      finicio: [null],
      fechaFin: [null],
    });
  }

  ngOnInit(): void {
  }

  changeCategoriaproducto($event: any) {
    // Tu lógica aquí
  }
}
