export type User = {
  id: number;
  username: string;
};

export type Message = {
  id: number;
  author: User;
  content: string;
};

export type Room = {
  id: number;
  name: string;
  participants: User[];
  messages: Message[];
};
