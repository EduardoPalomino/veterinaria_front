export interface Pago {
  _id: string;
  venta_id: string;
  medio_pago: string;
  cuota: string;
  monto: string;
  estado: string;
  fecha_pago: string;
  fecha_vencimiento: string;
  created_at: string;
  updated_at: string;
}
