import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mascota } from '../interfaces/mascota.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {

  private apiUrl = `${environment.API_URL}${environment.MASCOTA_ENDPOINT}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(this.apiUrl);
  }

  getById(id: string): Observable<Mascota> {
    return this.http.get<Mascota>(`${this.apiUrl}/${id}`);
  }

  create(data: Mascota): Observable<Mascota> {
    return this.http.post<Mascota>(`${this.apiUrl}/create`, data);
  }

  update(id: string, data: Mascota): Observable<Mascota> {
    return this.http.put<Mascota>(`${this.apiUrl}/update/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}