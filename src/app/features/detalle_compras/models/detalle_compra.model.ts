import { Detalle_compra } from '../interfaces/detalle_compra.interface';

export class Detalle_compraModel implements Detalle_compra {
  _id = '';
  compra_id = '';
  producto_id = '';
  cantidad = '';
  precio_compra = '';
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Detalle_compra>) {
    Object.assign(this, data);
  }
}