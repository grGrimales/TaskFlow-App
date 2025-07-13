// src-front/app/services/comments.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
 private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCommentsByTask(taskId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/tasks/${taskId}/comments`);
  }

  addComment(taskId: string, text: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/tasks/${taskId}/comments`, { text });
  }
}