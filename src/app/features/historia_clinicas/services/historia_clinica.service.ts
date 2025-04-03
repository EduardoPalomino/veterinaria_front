import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Historia_clinica } from '../interfaces/historia_clinica.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Historia_clinicaService {

  private apiUrl = `${environment.API_URL}${environment.HISTORIA_CLINICA_ENDPOINT}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Historia_clinica[]> {
    return this.http.get<Historia_clinica[]>(this.apiUrl);
  }

  getById(id: string): Observable<Historia_clinica> {
    return this.http.get<Historia_clinica>(`${this.apiUrl}/${id}`);
  }

  create(data: Historia_clinica): Observable<Historia_clinica> {
    return this.http.post<Historia_clinica>(`${this.apiUrl}/create`, data);
  }

  update(id: string, data: Historia_clinica): Observable<Historia_clinica> {
    return this.http.put<Historia_clinica>(`${this.apiUrl}/update/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}