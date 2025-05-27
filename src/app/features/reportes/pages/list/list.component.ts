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
  data: any;
  options: any;

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
     this.initChart();
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
  initChart() {

      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      this.data = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: [
          {
            label: 'Ventas',
            backgroundColor: documentStyle.getPropertyValue('--p-purple-500'),
            borderColor: documentStyle.getPropertyValue('--p-purple-500'),
            data: [65, 59, 80, 81, 56, 55, 40, 50, 45, 70, 85, 90]
          }
        ]
      };

      this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          legend: {
            labels: {
              color: textColor
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
              font: {
                weight: 500
              }
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false
            }
          },
          y: {
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false
            }
          }
        }
      };

  }



}
