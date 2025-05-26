import type { IUser } from './User.ts';

export interface IMessage {
  id: number;
  author: IUser;
  content: string;
}
