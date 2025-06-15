import { Page } from '../interfaces/page.interface';

export class PageModel implements Page {
  _id = '';
  order = '';
  ruta = '';
  nombre = '';
  descripcion = '';
  icon = '';
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Page>) {
    Object.assign(this, data);
  }
}