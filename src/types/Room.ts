import type { IMessage } from './Message.ts';
import type { IUser } from './User.ts';

export interface IRoom {
  id: number;
  name: string;
  participants: IUser[];
  messages: IMessage[];
}
