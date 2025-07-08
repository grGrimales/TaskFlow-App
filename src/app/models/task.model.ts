import { User } from "./user.model";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  column: string;
  assignedUsers: User[];
}