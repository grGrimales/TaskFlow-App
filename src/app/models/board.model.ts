import { User } from "./user.model";

export interface Board {
  _id: string;
  name: string;
  description: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  members: User[];
}