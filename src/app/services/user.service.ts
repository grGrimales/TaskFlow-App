// src/app/services/user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // La URL base de tu API, definida en el archivo de entorno
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  /**
   * Busca usuarios en el backend por nombre o email.
   * @param query El término de búsqueda.
   * @returns Un Observable con un array de usuarios.
   */
  search(query: string): Observable<User[]> {
    // Realiza una petición GET a -> http://localhost:3000/users/search?q=...
    return this.http.get<User[]>(`${this.apiUrl}/search`, {
      params: { q: query }
    });
  }
}