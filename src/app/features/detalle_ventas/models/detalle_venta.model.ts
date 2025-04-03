import { Detalle_venta } from '../interfaces/detalle_venta.interface';

export class Detalle_ventaModel implements Detalle_venta {
  _id = '';
  venta_id = '';
  producto_id = '';
  cantidad = '';
  precio_venta = '';
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Detalle_venta>) {
    Object.assign(this, data);
  }
}