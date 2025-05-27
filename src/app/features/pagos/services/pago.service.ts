import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pago } from '../interfaces/pago.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  private apiUrl = `${environment.API_URL}${environment.PAGO_ENDPOINT}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Pago[]> {
    return this.http.get<Pago[]>(this.apiUrl);
  }

  getById(id: string): Observable<Pago> {
    return this.http.get<Pago>(`${this.apiUrl}/${id}`);
  }

  create(data: Pago): Observable<Pago> {
    return this.http.post<Pago>(`${this.apiUrl}/create`, data);
  }

  update(id: string, data: Pago): Observable<Pago> {
    return this.http.put<Pago>(`${this.apiUrl}/update/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}