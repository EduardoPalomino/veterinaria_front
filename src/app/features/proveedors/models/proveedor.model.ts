import { Proveedor } from '../interfaces/proveedor.interface';

export class ProveedorModel implements Proveedor {
  _id = '';
  nombre = '';
  ruc = '';
  telefono = '';
  email = '';
  direccion = '';
  contacto = '';
  observaciones = '';
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Proveedor>) {
    Object.assign(this, data);
  }
}