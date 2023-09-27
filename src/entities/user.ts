import { Command } from './command';

export type WithId = {
  id: string;
};

export type LoginData = {
  userName: string;
  password: string;
};

export type UserNoId = LoginData & {
  firstName: string;
  lastName: string;
  comands: Command[];
  email: string;
  age: string;
};

export type User = WithId & UserNoId;
