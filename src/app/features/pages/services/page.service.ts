import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../interfaces/page.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  private apiUrl = `${environment.API_URL}${environment.PAGE_ENDPOINT}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Page[]> {
    return this.http.get<Page[]>(this.apiUrl);
  }

  getById(id: string): Observable<Page> {
    return this.http.get<Page>(`${this.apiUrl}/${id}`);
  }

  create(data: Page): Observable<Page> {
    return this.http.post<Page>(`${this.apiUrl}/create`, data);
  }

  update(id: string, data: Page): Observable<Page> {
    return this.http.put<Page>(`${this.apiUrl}/update/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}