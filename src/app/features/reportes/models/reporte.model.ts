import { Reporte } from '../interfaces/reporte.interface';

export class ReporteModel implements Reporte {
  _id = '';
  tipo_reporte = '';
  fecha_generado = '';
  contenido = '';
  usuario_id = '';
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Reporte>) {
    Object.assign(this, data);
  }
}