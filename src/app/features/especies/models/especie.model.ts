import { Especie } from '../interfaces/especie.interface';

export class EspecieModel implements Especie {
  _id = '';
  descripcion = '';
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Especie>) {
    Object.assign(this, data);
  }
}