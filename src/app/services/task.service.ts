// src/app/services/task.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000'; // URL base

  constructor(private http: HttpClient) { }

  // Crear una nueva tarea en una columna específica
  createTask(columnId: string, taskData: { title: string; description?: string }): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/columns/${columnId}/tasks`, taskData);
  }

  // Actualizar una tarea
  updateTask(taskId: string, taskData: { title?: string; description?: string }): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/tasks/${taskId}`, taskData);
  }

  // Eliminar una tarea
  deleteTask(taskId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/tasks/${taskId}`);
  }

  moveTask(
    taskId: string,
    sourceColumnId: string,
    sourceTaskIds: string[],
    destinationColumnId: string,
    destinationTaskIds: string[]
  ): Observable<void> {
    const moveData = { sourceColumnId, sourceTaskIds, destinationColumnId, destinationTaskIds };
    return this.http.patch<void>(`${this.apiUrl}/tasks/${taskId}/move`, moveData);
  }
  // --------------------
}
