import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageService } from '../../services/page.service';

import { Page } from '../../interfaces/page.interface';


@Component({
  selector: 'app-page-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class PageListComponent implements OnInit {
  pages: Page[] = [];
  filteredPages: Page[] = [];
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';


  pageForm: FormGroup;
  mode:string='';

  constructor(
  private fb: FormBuilder,
  private pageService: PageService,
  private confirmationService: ConfirmationService,
  private messageService: MessageService,
  ) {
    this.pageForm = this.fb.group({
      _id: [null],
      order: ['', Validators.required],
      ruta: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      icon: ['', Validators.required],
    });
  }

  ngOnInit(): void {

    this.loadPages();
  }

  loadPages() {
    this.pageService.getAll().subscribe({
      next: (data) => {
        this.pages = data.map(page=>({
          ...page,

        }));
        this.filteredPages = [...this.pages];
      },
      error: (err) => {
        console.error('Error al cargar Pages:', err);
      }
    });
  }



  applyGlobalFilter() {
    const filterValue = this.globalFilter.toLowerCase().trim();
    console.log('Filtrando:', filterValue);

    if (!filterValue) {
      this.filteredPages = [...this.pages];
      return;
    }

    this.filteredPages = this.pages.filter((page) =>
        Object.values(page).some(
            (value) =>
                value &&
                value.toString().toLowerCase().includes(filterValue)
        )
    );
  }

  openModal(mode: 'Nuevo' | 'Editar', page?: Page) {
    this.mode=mode;
    console.log(mode);
    this.modalTitle = `${mode} Page`;
    this.modalVisible = true;

    if (mode === 'Editar' && page) {
      this.pageForm.patchValue({
       _id: page._id,
      order: page.order,
      ruta: page.ruta,
      nombre: page.nombre,
      descripcion: page.descripcion,
      icon: page.icon
      });
    } else {
      this.pageForm.reset();
    }
  }

  confirmarEliminacion(page: Page) {
    console.log("Clic en eliminar:", page);
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el Page: ${page.order}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.deletePage(page);
      }
    });
  }

deletePage(page: Page) {
    this.pageService.delete(page._id).subscribe({
      next: () => {
        this.loadPages();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Page "${page.order}" eliminado correctamente`
        });
      },
      error: (err) => {
        console.error('Error al eliminar el page:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo eliminar el page "${page.order}"`
        });
      }
    });
  }

  saveRegistro() {
    if (this.pageForm.valid) { // Verifica que el formulario sea válido
      const page = this.pageForm.value; // Obtener valores del formulario

      console.log(JSON.stringify(page));
      page._id === null && delete page._id;
      console.log(JSON.stringify(page));

      if (this.mode === 'Nuevo') {
        this.pageService.create(page).subscribe({
          next: (data) => {
            console.log('Page guardado con éxito:', data);
            this.pages.push(data); // Agregar el nuevo page a la lista
            this.modalVisible = false; // Cerrar modal después de guardar
            this.loadPages(); // Recargar lista de pages
            this.mensajeConfirmacion(page,"Registro Actualizado");
          },
          error: (err) => {
            console.error('Error al guardar el page:', err);
          }
        });
      }else{
        this.pageService.update(page._id, page).subscribe(() => {
          this.modalVisible = false;
          this.loadPages();
          this.mensajeConfirmacion(page,"Registro Actualizado");
        });
      }
    }
  }



  mensajeConfirmacion(page: Page,mensaje:String){
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: ` Page "${page.order}" ${mensaje}`
    });
  }



}
