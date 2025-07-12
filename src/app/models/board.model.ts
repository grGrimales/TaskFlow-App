import { User } from "./user.model";
import { Column } from './column.model'; // Asumiendo que también tienes un column.model.ts


export interface Board {
_id: string;
  name: string;
  description?: string;
  owner: string; // o User si lo quieres populado
  columns: Column[];
  members: User[];
  createdAt: string;
  updatedAt: string;
}