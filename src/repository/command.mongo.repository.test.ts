import { Command, CommandNoId } from '../entities/command.js';
import { CommandModel } from './command.mongo.model.js';
import { CommandMongoRepository } from './command.mongo.repository.js';

describe('Given the class CommandMongoRepository', () => {
  describe('When i instance it', () => {
    const mockData = {} as unknown as Command;
    const mockDataNoId = {} as unknown as CommandNoId;
    CommandModel.find = jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValue([]) });

    CommandModel.findById = jest.fn().mockReturnValueOnce({
      populate: jest.fn().mockReturnValueOnce({
        author: {},
        populate: jest.fn().mockReturnValueOnce({
          operatives: {},
          exec: jest.fn().mockResolvedValueOnce({}),
        }),
        exec: jest.fn().mockResolvedValueOnce({}),
      }),
      exec: jest.fn().mockResolvedValueOnce({}),
    });

    CommandModel.create = jest.fn().mockReturnValue(mockData);
    CommandModel.findByIdAndUpdate = jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValue(mockData) });
    CommandModel.findByIdAndDelete = jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValue('ok') });
    const repo = new CommandMongoRepository();
    test('Then getAll method should return commandData', async () => {
      const commandData = await repo.getAll();
      expect(commandData).toEqual([]);
    });
    test('Then get should return data', async () => {
      const commandData = await repo.get('');
      expect(commandData).toEqual({});
    });
    test('Then patch method should return data', async () => {
      const commandData = await repo.patch(mockData.id, mockDataNoId);
      expect(commandData).toEqual(mockData);
    });
    test('Then delete method should return data', async () => {
      const commandData = await repo.delete(mockData.id);
      expect(commandData).toEqual(undefined);
    });
    test('Then post method should return data', async () => {
      const commandData = await repo.post(mockDataNoId);
      expect(commandData).toEqual(mockData);
    });
    test('Then search method should return data', async () => {
      const commandData = await repo.search({ key: '', value: '' });
      expect(commandData).toEqual([]);
    });
  });
  describe('When i instance it', () => {
    const mockDataNoId = {} as unknown as CommandNoId;

    const repo = new CommandMongoRepository();
    test('Then get should return error', async () => {
      CommandModel.findById = jest.fn().mockResolvedValueOnce(new Error());
      expect(repo.get('')).rejects.toThrow();
    });
    test('Then patch should return error', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      CommandModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: mockExec,
      });
      expect(repo.patch('', mockDataNoId)).rejects.toThrow();
    });
    test('Then delete should return error', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      CommandModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec: mockExec,
      });
      expect(repo.delete('')).rejects.toThrow();
    });
  });
  describe('When i instance it', () => {
    test('toJSON method should transform the returned object', () => {
      const commandData = {} as unknown as Command;
      const command = new CommandModel(commandData);
      const commandObject = command.toJSON();
      expect(commandObject).not.toHaveProperty('_id');
      expect(commandObject).not.toHaveProperty('__v');
      expect(commandObject).toHaveProperty('id');
    });
  });
});
