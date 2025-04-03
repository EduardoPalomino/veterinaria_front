import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Detalle_venta } from '../interfaces/detalle_venta.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Detalle_ventaService {

  private apiUrl = `${environment.API_URL}${environment.DETALLE_VENTA_ENDPOINT}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Detalle_venta[]> {
    return this.http.get<Detalle_venta[]>(this.apiUrl);
  }

  getById(id: string): Observable<Detalle_venta> {
    return this.http.get<Detalle_venta>(`${this.apiUrl}/${id}`);
  }

  create(data: Detalle_venta): Observable<Detalle_venta> {
    return this.http.post<Detalle_venta>(`${this.apiUrl}/create`, data);
  }

  update(id: string, data: Detalle_venta): Observable<Detalle_venta> {
    return this.http.put<Detalle_venta>(`${this.apiUrl}/update/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}