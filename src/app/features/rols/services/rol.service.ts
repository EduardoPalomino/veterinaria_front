import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rol } from '../interfaces/rol.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private apiUrl = `${environment.API_URL}${environment.ROL_ENDPOINT}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.apiUrl);
  }

  getById(id: string): Observable<Rol> {
    return this.http.get<Rol>(`${this.apiUrl}/${id}`);
  }

  create(data: Rol): Observable<Rol> {
    return this.http.post<Rol>(`${this.apiUrl}/create`, data);
  }

  update(id: string, data: Rol): Observable<Rol> {
    return this.http.put<Rol>(`${this.apiUrl}/update/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}