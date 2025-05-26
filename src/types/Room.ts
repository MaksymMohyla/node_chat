import type { IUser } from './User.ts';

export interface IRoom {
  id: number;
  name: string;
  participants: IUser[];
}
