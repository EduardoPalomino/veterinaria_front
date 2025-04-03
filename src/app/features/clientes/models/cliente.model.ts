import { Cliente } from '../interfaces/cliente.interface';

export class ClienteModel implements Cliente {
  _id = '';
  nombres = '';
  apellidos = '';
  dni = '';
  telefono = '';
  direccion = '';
  email = '';
  indicacion_general = '';
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Cliente>) {
    Object.assign(this, data);
  }
}