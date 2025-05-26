export type User = {
  id: string;
  username: string;
};

export type Message = {
  id: string;
  author: User;
  content: string;
};

export type Room = {
  id: string;
  name: string;
  participants: User[];
  messages: Message[];
};
