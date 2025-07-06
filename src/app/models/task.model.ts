// src/app/models/task.model.ts
export interface Task {
  _id: string;
  title: string;
  description?: string;
  column: string;
}