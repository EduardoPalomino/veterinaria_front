import { Venta } from '../interfaces/venta.interface';

export class VentaModel implements Venta {
  _id = '';
  fecha = '';
  total = '';
  tipo_pago = '';
  cantidad_cuota = 0;
  estado= '';
  cliente_id = '';
  usuario_id = '';
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Venta>) {
    Object.assign(this, data);
  }
}
