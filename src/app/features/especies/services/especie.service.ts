import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Especie } from '../interfaces/especie.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EspecieService {

  private apiUrl = `${environment.API_URL}${environment.ESPECIE_ENDPOINT}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Especie[]> {
    return this.http.get<Especie[]>(this.apiUrl);
  }

  getById(id: string): Observable<Especie> {
    return this.http.get<Especie>(`${this.apiUrl}/${id}`);
  }

  create(data: Especie): Observable<Especie> {
    return this.http.post<Especie>(`${this.apiUrl}/create`, data);
  }

  update(id: string, data: Especie): Observable<Especie> {
    return this.http.put<Especie>(`${this.apiUrl}/update/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}