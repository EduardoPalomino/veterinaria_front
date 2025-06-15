import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AccesoService } from '../../services/acceso.service';
import { RolService } from '../../../rols/services/rol.service';
import { PageService } from '../../../pages/services/page.service';
import { Acceso } from '../../interfaces/acceso.interface';
import { Rol } from '../../../rols/interfaces/rol.interface';
import { Page } from '../../../pages/interfaces/page.interface';
import {Proveedor} from "../../../proveedors/interfaces/proveedor.interface";


type IPage = Omit<Page,'created_at'|'updated_at'>& {
  checked:boolean;
};

@Component({
  selector: 'app-acceso-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class AccesoListComponent implements OnInit {
  accesos: Acceso[] = [];
  filteredAccesos: Acceso[] = [];
  modalVisible: boolean = false;
  modalTitle: string = '';
  rols: Rol[] = [];
  pages: IPage[] = [];
  ipages: IPage[] = [];
  selected_rol: { label:string; value:string }[] = [{ label:'Seleccione Rol',value:'0' }];
  accesoForm: FormGroup;
  mode: string = '';
  categories: any[] = [];
  pageList = [
    { id: '01', nombre: 'Página 1', checked: true },
    { id: '02', nombre: 'Página 2', checked: false },
    { id: '03', nombre: 'Página 3', checked: true }
  ];
  selectedPages: IPage[] = [];
  constructor(
    private fb: FormBuilder,
    private accesoService: AccesoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private rolService: RolService,
    private pageService: PageService
  ) {
    this.accesoForm = this.fb.group({
      _id: [null],
      rol_id: ['', Validators.required],
      page: [''],
      selectedPages: this.fb.array([])
    });
  }

  // Getter para acceder fácilmente al FormArray
  logChange(page: any) {
    console.log(`Checkbox ${page.id} cambiado a:`, page.checked);
    // Aquí puedes llamar a una API, actualizar estado global, etc.
  }

  ngOnInit(): void {
    this.loadRols();
    this.loadAccesos();
    this.loadPages();
  }

  loadAccesos() {
    this.accesoService.getAll().subscribe({
      next: (data) => {
        this.accesos = data.map(acceso => ({
          ...acceso,
          rol_nombre: this.rols.find(rol => rol._id == acceso.rol_id)?.descripcion || 'Sin Rol'
        }));
        this.filteredAccesos = [...this.accesos];
      },
      error: (err) => {
        console.error('Error al cargar Accesos:', err);
      }
    });
  }

  loadRols() {
    this.rolService.getAll().subscribe({
      next: (data) => {
        this.rols = data;
        this.selected_rol = this.rols.map(rol => ({
          label: rol.descripcion,
          value: rol._id
        }));
      },
      error: (err) => {
        console.error('Error al cargar rols:', err);
      }
    });
  }

  // Modifica el loadPages para inicializar los checkboxes
  loadPages(): void {
    this.pageService.getAll().subscribe({
      next: (data: Page[]) => {

        this.ipages = data.map(d=>{
          return{
            _id:d._id,
            order: d.order,
            ruta: d.ruta,
            nombre: d.nombre,
            descripcion: d.descripcion,
            icon:  d.icon,
            checked: false,
          }

        })

        if (this.mode === 'Editar' && this.accesoForm.value._id) {

        }
      },
      error: (err: any) => {
        console.error('Error al cargar pages:', err);
      }
    });
  }
  openModal(mode: 'Nuevo' | 'Editar', acceso?: Acceso) {
    this.mode = mode;
    this.modalTitle = `${mode} Acceso`;
    this.modalVisible = true;

    if (mode === 'Editar' && acceso) {
      this.accesoForm.patchValue({
        _id: acceso._id,
        rol_id: acceso.rol_id,
        page: acceso.page
      });

      // Marcar checkboxes basado en datos existentes
     /* if (acceso.selectedPages) {
        this.categories.forEach((category, index) => {
          const isSelected = acceso.selectedPages.includes(category.key);
          this.selectedPages.at(index).setValue(isSelected);
        });
      }*/
    } else {
      this.accesoForm.reset();
      // Resetear todos los checkboxes

    }
  }
  confirmarEliminacion(acceso: Acceso) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el Acceso: ${acceso.rol_id}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.deleteAcceso(acceso);
      }
    });
  }
  deleteAcceso(acceso: Acceso) {
    this.accesoService.delete(acceso._id).subscribe({
      next: () => {
        this.loadAccesos();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Acceso "${acceso.rol_id}" eliminado correctamente`
        });
      },
      error: (err) => {
        console.error('Error al eliminar el acceso:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo eliminar el acceso "${acceso.rol_id}"`
        });
      }
    });
  }
  saveRegistro() {
    if (this.accesoForm.valid) {
     // const checkboxStatus = this.getCheckboxStatus();
      const formData = this.accesoForm.value;
      console.log(" JSON.stringify(this.accesos) "+JSON.stringify(this.pages,null,2))
      formData.page = JSON.stringify(this.pages);
      if (this.mode === 'Nuevo') {
        this.accesoService.create(formData).subscribe({
          next: (data) => {
            this.accesos.push(data);
            this.modalVisible = false;
            this.loadAccesos();
            this.mensajeConfirmacion(data, "Registro Creado");
          },
          error: (err) => {
            console.error('Error al guardar el acceso:', err);
          }
        });
      } else {
        this.accesoService.update(formData._id, formData).subscribe(() => {
          this.modalVisible = false;
          this.loadAccesos();
          this.mensajeConfirmacion(formData, "Registro Actualizado");
        });
      }
    }
  }
  onChangeRol(e: any) {
    const rol_id= e.value
    this.accesoForm.patchValue({ rol_id: rol_id });
    const registro = this.findAcceso(rol_id);
    if(!registro){
      this.mode='Nuevo';
      this.pages = this.ipages;
    }else{
      this.mode='Editar';
      this.accesoForm.value._id=this.accesos.find(acceso => acceso.rol_id == rol_id)?._id!
      this.pages = JSON.parse(this.accesos.find(acceso => acceso.rol_id == rol_id)?.page!);
      this.findChecked();
      console.log(JSON.stringify(this.selectedPages,null,2))
    }
  }

  private findAcceso(rol_id: string): Acceso | undefined {
    return this.accesos.find(p => p.rol_id === rol_id);
  }

  mensajeConfirmacion(acceso: Acceso, mensaje: String) {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: `${mensaje}`
    });
  }

  checkedPage(e:any,index:number){
    this.pages[index].checked = !this.pages[index].checked;
    console.log(JSON.stringify(this.pages,null,2))
    this.findChecked();
  }
  findChecked(){
    this.selectedPages=[];
    this.selectedPages = this.pages.filter(page => page.checked === true);
    console.log('------------SELECCIONADOS-------------')
   console.log(JSON.stringify(this.selectedPages,null,2))
  }


}
