import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Detalle_compra } from '../interfaces/detalle_compra.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Detalle_compraService {

  private apiUrl = `${environment.API_URL}${environment.DETALLE_COMPRA_ENDPOINT}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Detalle_compra[]> {
    return this.http.get<Detalle_compra[]>(this.apiUrl);
  }

  getById(id: string): Observable<Detalle_compra> {
    return this.http.get<Detalle_compra>(`${this.apiUrl}/${id}`);
  }

  create(data: Detalle_compra): Observable<Detalle_compra> {
    return this.http.post<Detalle_compra>(`${this.apiUrl}/create`, data);
  }

  update(id: string, data: Detalle_compra): Observable<Detalle_compra> {
    return this.http.put<Detalle_compra>(`${this.apiUrl}/update/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}