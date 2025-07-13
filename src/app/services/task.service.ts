// src/app/services/task.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';


interface CreateTaskPayload {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: string;
  labels?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000'; // URL base

  constructor(private http: HttpClient) { }

  // Crear una nueva tarea en una columna específica
  createTask(columnId: string, taskData: CreateTaskPayload): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/columns/${columnId}/tasks`, taskData);
  }

  // Actualizar una tarea
 updateTask(taskId: string, updates: { title?: string; description?: string; labels?: string[] }): Observable<Task> {

  console.log('Updating task:', taskId, 'with updates:', updates);
    return this.http.patch<Task>(`${this.apiUrl}/tasks/${taskId}`, updates);
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
  
  assignUsers(taskId: string, userIds: string[]): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/tasks/${taskId}/assign`, { userIds });
  }
}
