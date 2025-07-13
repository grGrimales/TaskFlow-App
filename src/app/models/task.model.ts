import { Label } from "./label.model";
import { User } from "./user.model";

export type Priority = 'Baja' | 'Media' | 'Alta';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  column: string;
  assignedUsers: User[];
    dueDate?: string; 
  priority: Priority;
  labels: Label[];
}