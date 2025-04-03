import { Historia_clinica } from '../interfaces/historia_clinica.interface';

export class Historia_clinicaModel implements Historia_clinica {
  _id = '';
  mascota_id = '';
  fecha = '';
  motivo_consulta = '';
  diagnostico = '';
  tratamiento = '';
  observaciones = '';
  usuario_id = '';
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Historia_clinica>) {
    Object.assign(this, data);
  }
}