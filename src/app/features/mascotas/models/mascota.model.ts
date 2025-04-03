import { Mascota } from '../interfaces/mascota.interface';

export class MascotaModel implements Mascota {
  _id = '';
  nombre = '';
  especie_id = '';
  raza_id = '';
  fecha_nacimiento = '';
  peso = '';
  sexo_id = '';
  cliente_id = '';
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Mascota>) {
    Object.assign(this, data);
  }
}