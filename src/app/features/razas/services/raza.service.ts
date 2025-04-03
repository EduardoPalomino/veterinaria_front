import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Raza } from '../interfaces/raza.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RazaService {

  private apiUrl = `${environment.API_URL}${environment.RAZA_ENDPOINT}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Raza[]> {
    return this.http.get<Raza[]>(this.apiUrl);
  }

  getById(id: string): Observable<Raza> {
    return this.http.get<Raza>(`${this.apiUrl}/${id}`);
  }

  create(data: Raza): Observable<Raza> {
    return this.http.post<Raza>(`${this.apiUrl}/create`, data);
  }

  update(id: string, data: Raza): Observable<Raza> {
    return this.http.put<Raza>(`${this.apiUrl}/update/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}