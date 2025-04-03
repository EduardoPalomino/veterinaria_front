import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta } from '../interfaces/venta.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private apiUrl = `${environment.API_URL}${environment.VENTA_ENDPOINT}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.apiUrl);
  }

  getById(id: string): Observable<Venta> {
    return this.http.get<Venta>(`${this.apiUrl}/${id}`);
  }

  create(data: Venta): Observable<Venta> {
    return this.http.post<Venta>(`${this.apiUrl}/create`, data);
  }

  update(id: string, data: Venta): Observable<Venta> {
    return this.http.put<Venta>(`${this.apiUrl}/update/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}