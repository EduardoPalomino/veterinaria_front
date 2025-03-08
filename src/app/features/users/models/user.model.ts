import { User } from '../interfaces/user.interface';

export class UserModel implements User {
  _id = '';
  nombre = '';
  apellido = '';
  email = '';
  password = '';
  rol_id = '';
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<User>) {
    Object.assign(this, data);
  }
}
