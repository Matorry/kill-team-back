import { NextFunction, Request, Response } from 'express';
import { Command, CommandNoId } from '../entities/command.js';
import { Operative } from '../entities/operative.js';
import { User } from '../entities/user.js';
import { CommandMongoRepository } from '../repository/command.mongo.repository.js';
import { OperativeMongoRepository } from '../repository/operative.mongo.repository.js';
import { UserMongoRepository } from '../repository/user.mongo.repository.js';
import { CloudinaryService } from '../services/mediaFiles.js';
import { CommandController } from './command.controller.js';

CloudinaryService.prototype.uploadImage = jest.fn();
UserMongoRepository.prototype.get = jest.fn().mockResolvedValue({
  comands: [
    { id: '1' } as unknown as Command,
    { id: '2' } as unknown as Command,
  ],
  id: '',
} as unknown as User);
UserMongoRepository.prototype.patch = jest
  .fn()
  .mockResolvedValue({} as unknown as User);
OperativeMongoRepository.prototype.get = jest
  .fn()
  .mockResolvedValue({} as unknown as Operative);
OperativeMongoRepository.prototype.delete = jest
  .fn()
  .mockResolvedValue('' as unknown as void);
describe('Given the module UserssControler', () => {
  const mockRepo: CommandMongoRepository = {
    getAll: jest
      .fn()
      .mockResolvedValueOnce([{ author: '1' }] as unknown as Command[]),
    get: jest.fn(),
    post: jest.fn().mockResolvedValueOnce({} as unknown as Command),
    patch: jest.fn().mockResolvedValueOnce({} as unknown as Command),
    delete: jest.fn(),
    search: jest.fn(),
  };

  const mockResponse = {
    status: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;

  const mockNext = jest.fn() as NextFunction;
  const commandController = new CommandController(mockRepo);
  describe('when we execute its methods and we have a successful answer', () => {
    test('should call create and return data', async () => {
      const mockRequest = {
        body: {} as unknown as CommandNoId,
        file: { destination: '/tmp', filename: 'test.png' },
      } as unknown as Request;
      await commandController.create(mockRequest, mockResponse, mockNext);
      expect(mockRepo.post).toHaveBeenCalled();
    });
    test('should call create and return error', async () => {
      const mockRequest = {
        body: {} as unknown as CommandNoId,
      } as unknown as Request;
      await commandController.create(mockRequest, mockResponse, mockNext);
      expect(mockRepo.post).toHaveBeenCalled();
    });
    test('should call updateWhithImg and return data', async () => {
      const mockRequest = {
        body: {} as unknown as CommandNoId,
        file: { destination: '/tmp', filename: 'test.png' },
      } as unknown as Request;
      await commandController.updateCommandWhithImg(
        mockRequest,
        mockResponse,
        mockNext
      );
      expect(mockRepo.patch).toHaveBeenCalled();
    });
    test('should call updateWhithImg and return error', async () => {
      const mockRequest = {
        body: {} as unknown as CommandNoId,
      } as unknown as Request;
      await commandController.updateCommandWhithImg(
        mockRequest,
        mockResponse,
        mockNext
      );
      expect(mockRepo.patch).toHaveBeenCalled();
    });
    test('should call deleteAndUpdate and return data', async () => {
      const mockRequest = {
        body: { author: '3' } as unknown as Command,
      } as unknown as Request;
      await commandController.deleteCommandAndUpdate(
        mockRequest,
        mockResponse,
        mockNext
      );
      expect(mockRepo.delete).toHaveBeenCalled();
    });
    test('should call deleteAndUpdate and return error', async () => {
      const mockRequest = {} as unknown as Request;
      await commandController.deleteCommandAndUpdate(
        mockRequest,
        mockResponse,
        mockNext
      );
      expect(mockRepo.delete).toHaveBeenCalled();
    });
    test('should call getUserCommands and return data', async () => {
      const mockRequest = { body: { validatedId: '1' } } as unknown as Request;
      await commandController.getUserCommands(
        mockRequest,
        mockResponse,
        mockNext
      );
      expect(mockRepo.getAll).toHaveBeenCalled();
    });
  });
});
