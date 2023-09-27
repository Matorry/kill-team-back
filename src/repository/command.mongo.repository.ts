import { Command, CommandNoId } from '../entities/command.js';
import { HttpError } from '../types/http.error.js';
import { CommandModel } from './command.mongo.model.js';
import { Repository } from './repository.js';

export class CommandMongoRepository implements Repository<Command> {
  async getAll(): Promise<Command[]> {
    const data = await CommandModel.find().exec();
    return data;
  }

  async get(id: string): Promise<Command> {
    const data = await CommandModel.findById(id)
      .populate('author', {})
      .populate('operatives', {})
      .exec();
    if (!data)
      throw new HttpError(
        404,
        'Not Found',
        'Command not found in file system',
        {
          cause: 'Trying getById',
        }
      );
    return data;
  }

  async post(newData: CommandNoId): Promise<Command> {
    const data = await CommandModel.create(newData);
    return data;
  }

  async patch(id: string, newData: Partial<Command>): Promise<Command> {
    const data = await CommandModel.findByIdAndUpdate(id, newData, {
      new: true,
    }).exec();
    if (!data)
      throw new HttpError(
        404,
        'Not Found',
        'Command not found in file system',
        {
          cause: 'Trying update',
        }
      );
    return data;
  }

  async delete(id: string): Promise<void> {
    const result = await CommandModel.findByIdAndDelete(id).exec();
    if (!result)
      throw new HttpError(
        404,
        'Not Found',
        'Command not found in file system',
        {
          cause: 'Trying delete',
        }
      );
  }

  async search({
    key,
    value,
  }: {
    key: string;
    value: unknown;
  }): Promise<Command[]> {
    const data = await CommandModel.find({ [key]: value }).exec();
    return data;
  }
}
