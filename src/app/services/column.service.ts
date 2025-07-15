import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Column } from '../models/column.model';

@Injectable({
  providedIn: 'root'
})
export class ColumnService {
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  getColumnsForBoard(boardId: string): Observable<Column[]> {
    return this.http.get<Column[]>(`${this.apiUrl}/boards/${boardId}/columns`);
  }

  createColumn(boardId: string, name: string): Observable<Column> {
    return this.http.post<Column>(`${this.apiUrl}/boards/${boardId}/columns`, { name });
  }

  updateColumn(columnId: string, name: string): Observable<Column> {
    return this.http.patch<Column>(`${this.apiUrl}/columns/${columnId}`, { name });
  }

  deleteColumn(columnId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/columns/${columnId}`);
  }
}
