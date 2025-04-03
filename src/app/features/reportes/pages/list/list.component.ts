import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReporteService } from '../../services/reporte.service';
import { UsuarioService } from '../../../usuarios/services/usuario.service';
import { Reporte } from '../../interfaces/reporte.interface';
import { Usuario } from '../../../usuarios/interfaces/usuario.interface';

@Component({
  selector: 'app-reporte-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class ReporteListComponent implements OnInit {
  reportes: Reporte[] = [];
  filteredReportes: Reporte[] = [];
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  usuarios: Usuario[]= [];
  selected_usuario:{ label: string; value: string }[]=[];
  reporteForm: FormGroup;
  mode:string='';

  constructor(
  private fb: FormBuilder,
  private reporteService: ReporteService,
  private confirmationService: ConfirmationService,
  private messageService: MessageService,
  private usuarioService:UsuarioService
  ) {
    this.reporteForm = this.fb.group({
      _id: [null],
      tipo_reporte: ['', Validators.required],
      fecha_generado: ['', Validators.required],
      contenido: ['', Validators.required],
      usuario_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
     this.loadUsuarios();
    this.loadReportes();
  }

  loadReportes() {
    this.reporteService.getAll().subscribe({
      next: (data) => {
        this.reportes = data.map(reporte=>({
          ...reporte,
          usuario_nombre:this.usuarios.find(usuario=>usuario._id==reporte.usuario_id)?.nombre||'Sin Usuario'
        }));
        this.filteredReportes = [...this.reportes];
      },
      error: (err) => {
        console.error('Error al cargar Reportes:', err);
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

  applyGlobalFilter() {
    const filterValue = this.globalFilter.toLowerCase().trim();
    console.log('Filtrando:', filterValue);

    if (!filterValue) {
      this.filteredReportes = [...this.reportes];
      return;
    }

    this.filteredReportes = this.reportes.filter((reporte) =>
        Object.values(reporte).some(
            (value) =>
                value &&
                value.toString().toLowerCase().includes(filterValue)
        )
    );
  }

  openModal(mode: 'Nuevo' | 'Editar', reporte?: Reporte) {
    this.mode=mode;
    console.log(mode);
    this.modalTitle = `${mode} Reporte`;
    this.modalVisible = true;

    if (mode === 'Editar' && reporte) {
      this.reporteForm.patchValue({
       _id: reporte._id,
      tipo_reporte: reporte.tipo_reporte,
      fecha_generado: reporte.fecha_generado,
      contenido: reporte.contenido,
      usuario_id: reporte.usuario_id
      });
    } else {
      this.reporteForm.reset();
    }
  }

  confirmarEliminacion(reporte: Reporte) {
    console.log("Clic en eliminar:", reporte);
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el Reporte: ${reporte.tipo_reporte}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.deleteReporte(reporte);
      }
    });
  }

deleteReporte(reporte: Reporte) {
    this.reporteService.delete(reporte._id).subscribe({
      next: () => {
        this.loadReportes();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Reporte "${reporte.tipo_reporte}" eliminado correctamente`
        });
      },
      error: (err) => {
        console.error('Error al eliminar el reporte:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo eliminar el reporte "${reporte.tipo_reporte}"`
        });
      }
    });
  }

  saveRegistro() {
    if (this.reporteForm.valid) { // Verifica que el formulario sea válido
      const reporte = this.reporteForm.value; // Obtener valores del formulario

      console.log(JSON.stringify(reporte));
      reporte._id === null && delete reporte._id;
      console.log(JSON.stringify(reporte));

      if (this.mode === 'Nuevo') {
        this.reporteService.create(reporte).subscribe({
          next: (data) => {
            console.log('Reporte guardado con éxito:', data);
            this.reportes.push(data); // Agregar el nuevo reporte a la lista
            this.modalVisible = false; // Cerrar modal después de guardar
            this.loadReportes(); // Recargar lista de reportes
            this.mensajeConfirmacion(reporte,"Registro Actualizado");
          },
          error: (err) => {
            console.error('Error al guardar el reporte:', err);
          }
        });
      }else{
        this.reporteService.update(reporte._id, reporte).subscribe(() => {
          this.modalVisible = false;
          this.loadReportes();
          this.mensajeConfirmacion(reporte,"Registro Actualizado");
        });
      }
    }
  }

  onChangeUsuario(e: any) {
        this.reporteForm.patchValue({usuario_id:e.value});
       }

  mensajeConfirmacion(reporte: Reporte,mensaje:String){
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: ` Reporte "${reporte.tipo_reporte}" ${mensaje}`
    });
  }



}
