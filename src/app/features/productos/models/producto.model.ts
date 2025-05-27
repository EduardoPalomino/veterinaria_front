import { Producto } from '../interfaces/producto.interface';

export class ProductoModel implements Producto {
  _id = '';
  nombre = '';
  foto = '';
  categoria_producto_id = '';
  tamano = '';
  precio_venta = '';
  stock = '';
  descripcion = '';
  proveedor_id = '';
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Producto>) {
    Object.assign(this, data);
  }
}
