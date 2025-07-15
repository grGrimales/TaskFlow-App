import { Task } from './task.model'; 

export interface Column {
  _id: string;
  name: string;
  board: string;
  tasks: Task[]; 
}