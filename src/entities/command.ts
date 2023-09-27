import { ImgData } from '../types/image';
import { Operative } from './operative';
import { User, WithId } from './user';

export type CommandNoId = {
  author: User;
  name: string;
  faction: string;
  operatives: Operative[];
  size: string;
  imageData: ImgData;
};

export type Command = WithId & CommandNoId;
