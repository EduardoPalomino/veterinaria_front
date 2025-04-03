import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reporte } from '../interfaces/reporte.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private apiUrl = `${environment.API_URL}${environment.REPORTE_ENDPOINT}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Reporte[]> {
    return this.http.get<Reporte[]>(this.apiUrl);
  }

  getById(id: string): Observable<Reporte> {
    return this.http.get<Reporte>(`${this.apiUrl}/${id}`);
  }

  create(data: Reporte): Observable<Reporte> {
    return this.http.post<Reporte>(`${this.apiUrl}/create`, data);
  }

  update(id: string, data: Reporte): Observable<Reporte> {
    return this.http.put<Reporte>(`${this.apiUrl}/update/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}