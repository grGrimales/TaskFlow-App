import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Label } from '../models/label.model';


@Injectable({
  providedIn: 'root'
})
export class LabelsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getLabelsByBoard(boardId: string): Observable<Label[]> {
    return this.http.get<Label[]>(`${this.apiUrl}/boards/${boardId}/labels`);
  }

  createLabel(boardId: string, name: string, color: string): Observable<Label> {
    return this.http.post<Label>(`${this.apiUrl}/boards/${boardId}/labels`, { name, color });
  }
}