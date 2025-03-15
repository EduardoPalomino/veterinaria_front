import { Rol } from '../interfaces/rol.interface';

export class RolModel implements Rol {
  _id = '';
  descripcion = '';
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Rol>) {
    Object.assign(this, data);
  }
}