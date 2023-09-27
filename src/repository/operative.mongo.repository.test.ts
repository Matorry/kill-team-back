import { Operative, OperativeNoId } from '../entities/operative.js';
import { OperativeModel } from './operative.mongo.model.js';
import { OperativeMongoRepository } from './operative.mongo.repository.js';

describe('Given the class OperativeMongoRepository', () => {
  describe('When i instance it', () => {
    const operativeDataMock = {} as unknown as Operative;
    const operativeDataNoIdMock = {} as unknown as OperativeNoId;
    OperativeModel.find = jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValue([]) });

    OperativeModel.findById = jest.fn().mockReturnValueOnce({
      populate: jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValueOnce({}) }),
      exec: jest.fn().mockResolvedValueOnce({}),
    });

    OperativeModel.create = jest.fn().mockReturnValue(operativeDataMock);
    OperativeModel.findByIdAndUpdate = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(operativeDataMock),
    });
    OperativeModel.findByIdAndDelete = jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValue('ok') });
    const repo = new OperativeMongoRepository();
    test('Then getAll should return data', async () => {
      const data = await repo.getAll();
      expect(data).toEqual([]);
    });
    test('Then get should return data', async () => {
      const result = await repo.get('');
      expect(result).toEqual({});
    });
    test('Then patch should return data', async () => {
      const result = await repo.patch(
        operativeDataMock.id,
        operativeDataNoIdMock
      );
      expect(result).toEqual(operativeDataMock);
    });
    test('Then delete should return data', async () => {
      const result = await repo.delete(operativeDataMock.id);
      expect(result).toEqual(undefined);
    });
    test('Then post should return data', async () => {
      const result = await repo.post(operativeDataNoIdMock);
      expect(result).toEqual(operativeDataMock);
    });
    test('Then search should return data', async () => {
      const result = await repo.search({ key: '', value: '' });
      expect(result).toEqual([]);
    });
    test('toJSON method should transform the returned object', () => {
      const operativeData = {} as unknown as Operative;
      const operative = new OperativeModel(operativeData);
      const operativeObject = operative.toJSON();
      expect(operativeObject).not.toHaveProperty('_id');
      expect(operativeObject).not.toHaveProperty('__v');
      expect(operativeObject).toHaveProperty('id');
    });
  });
  describe('When i instance it with errors', () => {
    const mockDataNoId = {} as unknown as OperativeNoId;

    const repo = new OperativeMongoRepository();
    test('Then get method should return error', async () => {
      const execMock = jest.fn().mockResolvedValue(null);
      OperativeModel.findById = jest.fn().mockReturnValue({
        exec: execMock,
      });
      expect(repo.get('')).rejects.toThrow();
    });
    test('Then patch method should return error', async () => {
      const execMock = jest.fn().mockResolvedValue(null);
      OperativeModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: execMock,
      });
      expect(repo.patch('', mockDataNoId)).rejects.toThrow();
    });
    test('Then delete method should return error', async () => {
      const execMock = jest.fn().mockResolvedValue(null);
      OperativeModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec: execMock,
      });
      expect(repo.delete('')).rejects.toThrow();
    });
  });
});
