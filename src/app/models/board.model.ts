import { User } from "./user.model";
import { Column } from './column.model'; 


export interface Board {
_id: string;
  name: string;
  description?: string;
  owner: string; 
  columns: Column[];
  members: User[];
  createdAt: string;
  updatedAt: string;
}