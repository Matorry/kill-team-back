import { Operative, OperativeNoId } from '../entities/operative.js';
import { HttpError } from '../types/http.error.js';
import { OperativeModel } from './operative.mongo.model.js';
import { Repository } from './repository.js';

export class OperativeMongoRepository implements Repository<Operative> {
  async getAll(): Promise<Operative[]> {
    const data = await OperativeModel.find().exec();
    return data;
  }

  async get(id: string): Promise<Operative> {
    const data = await OperativeModel.findById(id)
      .populate('command', {})
      .exec();
    if (!data)
      throw new HttpError(
        404,
        'Not Found',
        'Operative not found in file system',
        {
          cause: 'Trying getById',
        }
      );
    return data;
  }

  async post(newData: OperativeNoId): Promise<Operative> {
    const data = await OperativeModel.create(newData);
    return data;
  }

  async patch(id: string, newData: Partial<Operative>): Promise<Operative> {
    const data = await OperativeModel.findByIdAndUpdate(id, newData, {
      new: true,
    }).exec();
    if (!data)
      throw new HttpError(
        404,
        'Not Found',
        'Operative not found in file system',
        {
          cause: 'Trying update',
        }
      );
    return data;
  }

  async delete(id: string): Promise<void> {
    const result = await OperativeModel.findByIdAndDelete(id).exec();
    if (!result)
      throw new HttpError(
        404,
        'Not Found',
        'Operative not found in file system',
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
  }): Promise<Operative[]> {
    const data = await OperativeModel.find({ [key]: value }).exec();
    return data;
  }
}
