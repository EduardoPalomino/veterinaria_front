import { Raza } from '../interfaces/raza.interface';

export class RazaModel implements Raza {
  _id = '';
  descripcion = '';
  especie_id = '';
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Raza>) {
    Object.assign(this, data);
  }
}