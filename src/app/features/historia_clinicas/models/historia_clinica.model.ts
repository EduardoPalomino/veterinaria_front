import { Historia_clinica } from '../interfaces/historia_clinica.interface';

export class Historia_clinicaModel implements Historia_clinica {
  _id = '';
  mascota_id = '';
  fecha= '';
  peso= '';
  tipo_visita= '';
  signo= '';
  alergia= '';
  fecha_proxima_control= '';
  frecuencia_cardiaca= '';
  frecuencia_respiratoria= '';
  temperatura= '';
  prueba_complementaria= '';
  tllc= '';
  diagnostico= '';
  tratamiento= '';
  archivo= '';
  atendido_por = '';
  usuario_id = '';
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Historia_clinica>) {
    Object.assign(this, data);
  }
}
