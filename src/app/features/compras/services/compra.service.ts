import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compra } from '../interfaces/compra.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  private apiUrl = `${environment.API_URL}${environment.COMPRA_ENDPOINT}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Compra[]> {
    return this.http.get<Compra[]>(this.apiUrl);
  }

  getById(id: string): Observable<Compra> {
    return this.http.get<Compra>(`${this.apiUrl}/${id}`);
  }

  create(data: Compra): Observable<Compra> {
    return this.http.post<Compra>(`${this.apiUrl}/create`, data);
  }

  update(id: string, data: Compra): Observable<Compra> {
    return this.http.put<Compra>(`${this.apiUrl}/update/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}