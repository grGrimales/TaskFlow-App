import { Label } from "./label.model";
import { User } from "./user.model";

export type Priority = 'Baja' | 'Media' | 'Alta';

export interface ChecklistItem {
  _id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  column: string;
  assignedUsers: User[];
  dueDate?: string;
  priority: Priority;
  labels: Label[];
  checklist?: ChecklistItem[];
}