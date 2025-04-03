import { Categoria_producto } from '../interfaces/categoria_producto.interface';

export class Categoria_productoModel implements Categoria_producto {
  _id = '';
  nombre = '';
  descripcion = '';
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Categoria_producto>) {
    Object.assign(this, data);
  }
}