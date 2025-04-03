import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria_producto } from '../interfaces/categoria_producto.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Categoria_productoService {

  private apiUrl = `${environment.API_URL}${environment.CATEGORIA_PRODUCTO_ENDPOINT}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Categoria_producto[]> {
    return this.http.get<Categoria_producto[]>(this.apiUrl);
  }

  getById(id: string): Observable<Categoria_producto> {
    return this.http.get<Categoria_producto>(`${this.apiUrl}/${id}`);
  }

  create(data: Categoria_producto): Observable<Categoria_producto> {
    return this.http.post<Categoria_producto>(`${this.apiUrl}/create`, data);
  }

  update(id: string, data: Categoria_producto): Observable<Categoria_producto> {
    return this.http.put<Categoria_producto>(`${this.apiUrl}/update/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}