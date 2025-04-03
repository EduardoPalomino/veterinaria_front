import { Venta } from '../interfaces/venta.interface';

export class VentaModel implements Venta {
  _id = '';
  fecha = '';
  total = '';
  cliente_id = '';
  usuario_id = '';
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Venta>) {
    Object.assign(this, data);
  }
}