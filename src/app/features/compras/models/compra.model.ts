import { Compra } from '../interfaces/compra.interface';

export class CompraModel implements Compra {
  _id = '';
  fecha = '';
  total = '';
  proveedor_id = '';
  usuario_id = '';
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Compra>) {
    Object.assign(this, data);
  }
}