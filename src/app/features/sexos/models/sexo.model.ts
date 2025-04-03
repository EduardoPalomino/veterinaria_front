import { Sexo } from '../interfaces/sexo.interface';

export class SexoModel implements Sexo {
  _id = '';
  descripcion = '';
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Sexo>) {
    Object.assign(this, data);
  }
}