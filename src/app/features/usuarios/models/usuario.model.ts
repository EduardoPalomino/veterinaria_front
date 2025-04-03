import { Usuario } from '../interfaces/usuario.interface';

export class UsuarioModel implements Usuario {
  _id = '';
  nombre = '';
  apellido = '';
  email = '';
  password = '';
  rol_id = '';
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Usuario>) {
    Object.assign(this, data);
  }
}