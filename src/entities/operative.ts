import { ImgData } from '../types/image';
import { Command } from './command';
import { WithId } from './user';

export type OperativeNoId = {
  command: Command;
  name: string;
  operativeType: string;
  faction: string;
  imageData: ImgData;
  moviment: string;
  actionPointLimit: string;
  groupActivation: string;
  defence: string;
  save: string;
  wounds: string;
};

export type Operative = WithId & OperativeNoId;
