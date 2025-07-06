// src/app/models/column.model.ts
import { Task } from './task.model'; // <-- Importar

export interface Column {
  _id: string;
  name: string;
  board: string;
  tasks: Task[]; // <-- Añadir esta propiedad
}