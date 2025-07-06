// src/app/services/column.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Column } from '../models/column.model';

@Injectable({
  providedIn: 'root'
})
export class ColumnService {
  private apiUrl = 'http://localhost:3000'; // URL base de la API

  constructor(private http: HttpClient) {}

  // Obtener todas las columnas de un tablero
  getColumnsForBoard(boardId: string): Observable<Column[]> {
    return this.http.get<Column[]>(`${this.apiUrl}/boards/${boardId}/columns`);
  }

  // Crear una nueva columna
  createColumn(boardId: string, name: string): Observable<Column> {
    return this.http.post<Column>(`${this.apiUrl}/boards/${boardId}/columns`, { name });
  }

  // Actualizar una columna
  updateColumn(columnId: string, name: string): Observable<Column> {
    return this.http.patch<Column>(`${this.apiUrl}/columns/${columnId}`, { name });
  }

  // Eliminar una columna
  deleteColumn(columnId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/columns/${columnId}`);
  }
}
