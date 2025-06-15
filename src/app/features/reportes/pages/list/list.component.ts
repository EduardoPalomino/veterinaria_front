import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReporteService } from '../../services/reporte.service';
import { MascotaService } from '../../../mascotas/services/mascota.service';
import { UsuarioService } from '../../../usuarios/services/usuario.service';
import { Detalle_compraService } from '../../../detalle_compras/services/detalle_compra.service';
import { VentaService } from '../../../ventas/services/venta.service';
import { Detalle_ventaService } from '../../../detalle_ventas/services/detalle_venta.service';
import { ProductoService } from '../../../productos/services/producto.service';
import { Reporte } from '../../interfaces/reporte.interface';
import { Mascota } from '../../../mascotas/interfaces/mascota.interface';
import { Usuario } from '../../../usuarios/interfaces/usuario.interface';
import { Detalle_compra } from '../../../detalle_compras/interfaces/detalle_compra.interface';
import { Detalle_venta } from '../../../detalle_ventas/interfaces/detalle_venta.interface';
import { Venta } from '../../../ventas/interfaces/venta.interface';
import { Producto } from '../../../productos/interfaces/producto.interface';

@Component({
  selector: 'app-reporte-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class ReporteListComponent implements OnInit {
  // Propiedades de datos
  reportes: Reporte[] = [];
  filteredReportes: Reporte[] = [];
  usuarios: Usuario[] = [];
  mascotas: Mascota[] = [];
  detalle_ventas: Detalle_venta[] = [];
  detalle_compras: Detalle_compra[] = [];
  productos: Producto[] = [];
  ventas: Venta[] = [];
  // Propiedades para selección
  selected_usuario: { label: string; value: string }[] = [];
  selected_mascota: { label: string; value: string }[] = [];

  // Propiedades de formulario
  reporteForm: FormGroup;
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  mode: string = '';

  // Propiedades para gráficos
  data: any;
  options: any;

  // Propiedades para cálculos
  cifraProductoInventario: string = '0';
  cifraPrecioInventario: string = '0';
  cifraCostoInventario: string = '0';
  cifraUtilidadTotal: string = '0';
  productosMasVendidos: any[] = [];
  constructor(
    private fb: FormBuilder,
    private reporteService: ReporteService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private usuarioService: UsuarioService,
    private mascotaService: MascotaService,
    private ventaService: VentaService,
    private detalle_ventaService: Detalle_ventaService,
    private detalle_compraService: Detalle_compraService,
    private productoService: ProductoService,
  ) {
    this.reporteForm = this.fb.group({
      fechaInicio: [null],
      fechaFin: [null]
    });
  }

  ngOnInit(): void {
    this.loadInitialData();

  }

  private loadInitialData(): void {
    // Primero cargamos los datos maestros
    this.loadUsuarios();
    this.loadMascotas();
    this.loadProductos();

    // Luego cargamos los datos transaccionales que dependen de los anteriores
    this.loadDetalle_compras();
    this.loadVentas();
    this.loadDetalle_ventas();

    // Finalmente cargamos los reportes
    this.loadReportes();
  }

  private loadReportes(): void {
    this.reporteService.getAll().subscribe({
      next: (data) => {
        this.reportes = data.map(reporte => ({
          ...reporte,
          usuario_nombre: this.usuarios.find(usuario => usuario._id == reporte.usuario_id)?.nombre || 'Sin Usuario'
        }));
        this.filteredReportes = [...this.reportes];
      },
      error: (err) => {
        console.error('Error al cargar Reportes:', err);
      }
    });
  }

  private loadUsuarios(): void {
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

  private loadMascotas(): void {
    this.mascotaService.getAll().subscribe({
      next: (data) => {
        this.mascotas = data;
        this.selected_mascota = data.map(mascota => ({
          label: mascota.nombre,
          value: mascota._id
        }));
      },
      error: (err) => {
        console.error('Error al cargar mascotas:', err);
      }
    });
  }

  private loadVentas(): void {
    this.ventaService.getAll().subscribe({
      next: (data) => {
        this.ventas = data;
        // Convertir fechas a nombres de meses (manejo seguro si this.ventas es undefined)
        const labelData = this.ventas?.map(v => this.formatDate(v.fecha)) || [];
        const dataTotalVenta = this.ventas?.map(v => Number(v.total)) || [];
        const meses = this.convertirFechasAMeses(labelData);


        // Si no hay meses, usar un array vacío para evitar errores
        this.initChart(meses.length > 0 ? meses : ['Sin datos'],dataTotalVenta);
      },
      error: (err) => {
        console.error('Error al cargar ventas:', err);
      }
    });
  }
  convertirStringsANumeros(arr: string[]): number[] {
    return arr.map(item => parseInt(item, 10)); // El 10 es la base decimal
  }



  private loadDetalle_ventas(): void {
    this.detalle_ventaService.getAll().subscribe({
      next: (data) => {
        this.detalle_ventas = data;
        this.calcularPrecioInventario();
        this.calcularUtilidadTotal(); // Llamamos aquí después de cargar ventas
        this.productosMasVendidos = this.getProductosMasVendidos(data);
        console.log(JSON.stringify(this.productosMasVendidos))
      },
      error: (err) => {
        console.error('Error al cargar ventas:', err);
      }
    });
  }

  private loadDetalle_compras(): void {
    this.detalle_compraService.getAll().subscribe({
      next: (data) => {
        this.detalle_compras = data;
        this.calcularCostoInventario();
        this.calcularUtilidadTotal(); // Llamamos aquí después de cargar compras
      },
      error: (err) => {
        console.error('Error al cargar compras:', err);
      }
    });
  }

  private loadProductos(): void {
    this.productoService.getAll().subscribe({
      next: (data) => {
        this.productos = data;
        this.calcularProductoInventario();
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      }
    });
  }

  // Métodos de cálculo
  getProductosMasVendidos(detalleVentas: Detalle_venta[]): {producto_id: string, nombre: string, cantidad: number}[] {
    // Paso 1: Agrupar y sumar cantidades por producto_id
    const ventasAgrupadas = detalleVentas.reduce((acc, venta) => {
      const productoId = venta.producto_id;
      acc[productoId] = (acc[productoId] || 0) + Number(venta.cantidad);
      return acc;
    }, {} as {[key: string]: number});

    // Paso 2: Convertir a array y ordenar
    const productosOrdenados = Object.entries(ventasAgrupadas)
      .map(([producto_id, cantidad]) => ({ producto_id, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);

    // Paso 3: Obtener nombres de productos (asumiendo que tienes this.productos)
    return productosOrdenados.map(item => {
      const producto = this.productos.find(p => p._id === item.producto_id);
      return {
        producto_id: item.producto_id,
        nombre: producto ? producto.nombre : 'Producto desconocido',
        cantidad: item.cantidad,
        // Puedes añadir más datos del producto si necesitas
        precio: producto ? producto.precio_venta : 0
      };
    });
  }
  private calcularProductoInventario(): void {
    const nro = this.productos
      .map(p => Number(p.stock) || 0)
      .reduce((a, b) => a + b, 0);
    this.cifraProductoInventario = String(nro);
  }

  private calcularPrecioInventario(): void {
    const nro = this.detalle_ventas
      .map(p => (Number(p.cantidad) * Number(p.precio_venta)) || 0)
      .reduce((a, b) => a + b, 0);
    this.cifraPrecioInventario = String(nro);
  }

  private calcularCostoInventario(): void {
    const nro = this.detalle_compras
      .map(p => (Number(p.cantidad) * Number(p.precio_compra)) || 0)
      .reduce((a, b) => a + b, 0);
    this.cifraCostoInventario = String(nro);
  }

  private calcularUtilidadTotal(): void {
    // Solo calculamos si ambos valores están disponibles
    if (this.cifraPrecioInventario && this.cifraCostoInventario) {
      const nro = Math.abs(Number(this.cifraPrecioInventario) - Number(this.cifraCostoInventario));
      this.cifraUtilidadTotal = String(nro);
    }
  }

  // Resto de métodos (filtros, gráficos, etc.)
  applyGlobalFilter(): void {
    const filterValue = this.globalFilter.toLowerCase().trim();

    if (!filterValue) {
      this.filteredReportes = [...this.reportes];
      return;
    }

    this.filteredReportes = this.reportes.filter((reporte) =>
      Object.values(reporte).some(
        (value) => value && value.toString().toLowerCase().includes(filterValue)
      )
    );
  }

  deleteReporte(reporte: Reporte): void {
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



  // Métodos auxiliares
  formatDate(isoString: string): string {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  formatDatePicker(date: Date): string {
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }
  convertirFechasAMeses(fechas: string[]): string[] {
    // Array con los nombres de los meses en español (en mayúsculas)
    const meses = [
      "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
      "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
    ];

    return fechas.map(fecha => {
      // Extraer el día, mes y año (el mes está en posición 1, pero restamos 1 porque el array es 0-based)
      const [dia, mes, año] = fecha.split('/').map(Number);
      return meses[mes - 1]; // Convertir el número del mes (1-12) a índice (0-11)
    });
  }
  private initChart(labelData: string[] = [],dataVenta:number[]=[]): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    this.data = {
      labels: labelData,//['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      datasets: [
        {
          label: 'Ventas',
          backgroundColor: documentStyle.getPropertyValue('--p-purple-500'),
          borderColor: documentStyle.getPropertyValue('--p-purple-500'),
          data: dataVenta//[65, 59, 80, 81, 56, 55, 40, 50, 45, 70, 85, 90]
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
  onAddTGrid($event: any): void {
    // Implementación según necesidad
  }




 /* private getVentasPorMes(fechaInicio?: Date, fechaFin?: Date): { labels: string[], data: number[] } {
    const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    // Inicializar array de ventas por mes
    const ventasPorMes = Array(12).fill(0);

    // Filtrar ventas por rango de fechas si existe
    const ventasFiltradas = fechaInicio && fechaFin
      ? this.detalle_ventas.filter(v => {
        const fechaVenta = new Date(v.created_at);
        return fechaVenta >= fechaInicio && fechaVenta <= fechaFin;
      })
      : this.detalle_ventas;

    // Procesar ventas
    ventasFiltradas.forEach(venta => {
      const fechaVenta = new Date(venta.created_at);
      const mes = fechaVenta.getMonth();
      ventasPorMes[mes] += Number(venta.cantidad) * Number(venta.precio_venta);
    });

    // Si hay filtro de fechas, mostrar solo los meses en el rango
    if (fechaInicio && fechaFin) {
      const mesInicio = fechaInicio.getMonth();
      const mesFin = fechaFin.getMonth();

      return {
        labels: nombresMeses.slice(mesInicio, mesFin + 1),
        data: ventasPorMes.slice(mesInicio, mesFin + 1)
      };
    }

    // Sin filtro, mostrar todos los meses
    return {
      labels: nombresMeses,
      data: ventasPorMes
    };
  }
  private initChart(fechaInicio?: Date, fechaFin?: Date): void {
    // Forzar la actualización del gráfico creando un nuevo objeto de datos
    const { labels, data } = this.getVentasPorMes(fechaInicio, fechaFin);

    this.data = {
      labels: [...labels], // Copia del array
      datasets: [{
        label: 'Ventas',
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--p-purple-500'),
        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--p-purple-500'),
        data: [...data] // Copia del array
      }]
    };

    // Esto fuerza la actualización del componente de gráfico
    this.data = {...this.data};
  }*/
  private filtrarProductosMasVendidos(fechaInicio: Date, fechaFin: Date): void {
    const ventasFiltradas = this.detalle_ventas.filter(venta => {
      const fechaVenta = new Date(venta.created_at);
      return fechaVenta >= fechaInicio && fechaVenta <= fechaFin;
    });

    //this.productosMasVendidos = this.getProductosMasVendidos(ventasFiltradas);
  }

  filtarFecha($event: any, tipoFecha: number) {
    // Obtener las fechas del formulario
    const fechaInicio = this.reporteForm.get('fechaInicio')?.value;
    const fechaFin = this.reporteForm.get('fechaFin')?.value;
    console
    // Validar que ambas fechas estén seleccionadas
    if (fechaInicio && fechaFin) {
      // Asegurarse que fechaFin sea mayor o igual a fechaInicio
      if (fechaFin < fechaInicio) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'La fecha final debe ser mayor o igual a la fecha inicial'
        });
        return;
      }

      // Actualizar el gráfico con el rango de fechas
     // this.initChart(fechaInicio, fechaFin);

      // También filtrar los productos más vendidos por fecha
      this.filtrarProductosMasVendidos(fechaInicio, fechaFin);
    } else {
      // Si no hay fechas seleccionadas, mostrar todos los datos
      this.initChart();
      this.productosMasVendidos = this.getProductosMasVendidos(this.detalle_ventas);
    }
  }



}
