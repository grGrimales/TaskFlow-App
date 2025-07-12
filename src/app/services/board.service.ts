// src/app/services/board.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Board } from '../models/board.model';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/boards';

  // Obtener todos los tableros del usuario logueado
  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(this.apiUrl);
  }

  // Obtener un tablero específico por su ID
  getBoard(id: string): Observable<Board> {
    return this.http.get<Board>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo tablero
  createBoard(boardData: { name: string; description?: string }): Observable<Board> {
    return this.http.post<Board>(this.apiUrl, boardData);
  }

  // Actualizar un tablero
  updateBoard(id: string, boardData: { name?: string; description?: string }): Observable<Board> {
    return this.http.patch<Board>(`${this.apiUrl}/${id}`, boardData);
  }

  // Eliminar un tablero
  deleteBoard(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  updateColumnOrder(boardId: string, columnIds: string[]): Observable<Board> {
    return this.http.patch<Board>(`${this.apiUrl}/${boardId}/column-order`, { columnIds });

  }

  addMember(boardId: string, email: string): Observable<Board> {
    return this.http.post<Board>(`${this.apiUrl}/${boardId}/members`, { email });
  }

    addMembers(boardId: string, emails: string[]): Observable<Board> {
    const url = `${this.apiUrl}/${boardId}/members`;
    // El cuerpo de la petición debe coincidir con tu AddMembersDto del backend
    const body = { emails }; 
    return this.http.post<Board>(url, body);
  }
}
