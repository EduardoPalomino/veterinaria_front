import { Pago } from '../interfaces/pago.interface';

export class PagoModel implements Pago {
  _id = '';
  venta_id = '';
  medio_pago = '';
  cuota = '';
  monto = '';
  estado = '';
  fecha_pago = '';
  fecha_vencimiento = '';
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Pago>) {
    Object.assign(this, data);
  }
}
