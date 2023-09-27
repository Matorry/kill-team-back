import { NextFunction, Request, Response } from 'express';
import { Command } from '../entities/command.js';
import { Operative, OperativeNoId } from '../entities/operative.js';
import { CommandMongoRepository } from '../repository/command.mongo.repository.js';
import { OperativeMongoRepository } from '../repository/operative.mongo.repository.js';
import { CloudinaryService } from '../services/mediaFiles.js';
import { OperativeController } from './operative.controller.js';

CloudinaryService.prototype.uploadImage = jest.fn();
CommandMongoRepository.prototype.get = jest
  .fn()
  .mockResolvedValue({ id: '1', operatives: [] } as unknown as Command);
CommandMongoRepository.prototype.patch = jest
  .fn()
  .mockResolvedValue({ id: '1', operatives: [] } as unknown as Command);
describe('Given the module UserssControler', () => {
  const repoMock: OperativeMongoRepository = {
    getAll: jest
      .fn()
      .mockResolvedValueOnce([{ command: '1' }] as unknown as Command[]),
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    search: jest.fn(),
  };

  const responseMock = {
    status: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;

  const mockNext = jest.fn() as NextFunction;
  const operativeController = new OperativeController(repoMock);
  describe('when we execute its methods and we have a successful answer', () => {
    test('should call create and return data', async () => {
      repoMock.post = jest.fn().mockRejectedValue({} as unknown as Operative);
      const requestMock = {
        body: { command: '1' } as unknown as OperativeNoId,
        file: {
          destination: '',
          filename: '',
        },
      } as unknown as Request;
      await operativeController.create(requestMock, responseMock, mockNext);
      expect(repoMock.post).toHaveBeenCalled();
    });
    test('should call create and return error', async () => {
      const requestMock = {
        body: {} as unknown as OperativeNoId,
      } as unknown as Request;
      await operativeController.create(requestMock, responseMock, mockNext);
      expect(repoMock.post).toHaveBeenCalled();
    });
    test('should call updateWhithImg and return data', async () => {
      const requestMock = {
        body: {} as unknown as OperativeNoId,
        file: {
          destination: '',
          filename: '',
        },
      } as unknown as Request;
      await operativeController.updateOperativeWhithImg(
        requestMock,
        responseMock,
        mockNext
      );
      expect(repoMock.patch).toHaveBeenCalled();
    });
    test('should call updateWhithImg and return error', async () => {
      const requestMock = {
        body: {} as unknown as OperativeNoId,
      } as unknown as Request;
      await operativeController.updateOperativeWhithImg(
        requestMock,
        responseMock,
        mockNext
      );
      expect(repoMock.patch).toHaveBeenCalled();
    });
    test('should call deleteAndUpdate and return data', async () => {
      const requestMock = {
        body: {} as unknown as Operative,
      } as unknown as Request;
      await operativeController.deleteOperativeAndUpdate(
        requestMock,
        responseMock,
        mockNext
      );
      expect(repoMock.delete).toHaveBeenCalled();
    });
    test('should call deleteAndUpdate and return error', async () => {
      const requestMock = {
        body: { command: '1' } as unknown as OperativeNoId,
      } as unknown as Request;
      await operativeController.deleteOperativeAndUpdate(
        requestMock,
        responseMock,
        mockNext
      );
      expect(repoMock.delete).toHaveBeenCalled();
    });
    test('should call getUserCommands and return data', async () => {
      const requestMock = {
        body: { validatedId: '1' },
        params: { id: '1' },
      } as unknown as Request;
      await operativeController.getCommandOperatives(
        requestMock,
        responseMock,
        mockNext
      );
      expect(repoMock.getAll).toHaveBeenCalled();
    });
  });
});
