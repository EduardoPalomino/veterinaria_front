import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sexo } from '../interfaces/sexo.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SexoService {

  private apiUrl = `${environment.API_URL}${environment.SEXO_ENDPOINT}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Sexo[]> {
    return this.http.get<Sexo[]>(this.apiUrl);
  }

  getById(id: string): Observable<Sexo> {
    return this.http.get<Sexo>(`${this.apiUrl}/${id}`);
  }

  create(data: Sexo): Observable<Sexo> {
    return this.http.post<Sexo>(`${this.apiUrl}/create`, data);
  }

  update(id: string, data: Sexo): Observable<Sexo> {
    return this.http.put<Sexo>(`${this.apiUrl}/update/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}