import { NextFunction, Request, Response } from 'express';
import { User } from '../entities/user';
import { UserMongoRepository } from '../repository/user.mongo.repository';
import { Auth } from '../services/auth.js';
import { UsersController } from './user.controller.js';

describe('Given the component UsersController', () => {
  describe('When we instantiate it ', () => {
    const mockRepo: UserMongoRepository = {
      getAll: jest.fn(),
      get: jest.fn(),
      post: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      search: jest.fn(),
    };
    const usersController = new UsersController(mockRepo);
    const mockData = {
      id: '1',
      userName: 'Matorry',
      email: 'blablabla@blablabla.com',
      password: '12345',
      firstName: 'Rodrigo',
      lastName: 'Martin',
      comands: [],
      age: '34',
    };
    const mockDataNoId = {
      userName: 'Matorry',
      email: 'blablabla@blablabla.com',
      password: '12345',
      firstName: 'Rodrigo',
      lastName: 'Martin',
      comands: [],
      age: '34',
    };
    const mockRequest = {
      params: '1',
      body: {
        password: '12345',
      },
    } as unknown as Request;
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn(),
    } as unknown as Response;
    const mockNext = jest.fn();
    test('then we should getAll return mockData', async () => {
      (mockRepo.getAll as jest.Mock).mockResolvedValue(mockData);
      await usersController.getAll(mockRequest, mockResponse, mockNext);
      expect(mockRepo.getAll).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });
    test('then we should get return mockData', async () => {
      (mockRepo.get as jest.Mock).mockResolvedValue(mockData);
      await usersController.get(mockRequest, mockResponse, mockNext);
      expect(mockRepo.get).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });
    test('then we should post return mockDataNoId', async () => {
      (mockRepo.post as jest.Mock).mockResolvedValue(mockDataNoId);
      await usersController.post(mockRequest, mockResponse, mockNext);
      expect(mockRepo.post).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockDataNoId);
    });
    test('then we should patch return mockData', async () => {
      const encryptedPassword = 'encrypted1';
      jest.spyOn(Auth, 'hash').mockResolvedValue(encryptedPassword);
      (mockRepo.patch as jest.Mock).mockResolvedValue(mockData);
      await usersController.patch(mockRequest, mockResponse, mockNext);
      expect(mockRepo.patch).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });
    test('then we should delete return mockData', async () => {
      (mockRepo.delete as jest.Mock).mockResolvedValue(mockData);
      await usersController.delete(mockRequest, mockResponse, mockNext);
      expect(mockRepo.delete).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });
    test('then we should login mockRepo have been called', async () => {
      (mockRepo.search as jest.Mock).mockResolvedValue([mockData]);
      Auth.compare = jest.fn().mockReturnValue(true);
      await usersController.login(mockRequest, mockResponse, mockNext);
      expect(mockRepo.search).toHaveBeenCalled();
    });
  });

  describe('When we instantiate it with error', () => {
    const mockRepo: UserMongoRepository = {
      getAll: jest.fn().mockRejectedValue(new Error('GetAll error')),
      get: jest.fn().mockRejectedValue(new Error('Get error')),
      post: jest.fn().mockRejectedValue(new Error('Post error')),
      patch: jest.fn().mockRejectedValue(new Error('Patch error')),
      delete: jest.fn().mockRejectedValue(new Error('Delete error')),
      search: jest.fn().mockRejectedValue(new Error('Search error')),
    };
    const usersController = new UsersController(mockRepo);
    const mockRequest = {
      params: '6',
      body: {
        password: '12345',
      },
    } as unknown as Request;
    const mockResponse = {
      json: jest.fn(),
    } as unknown as Response;
    const mockNext = jest.fn();
    test('then we should getAll with error', async () => {
      await usersController.getAll(mockRequest, mockResponse, mockNext);
      expect(mockRepo.getAll).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(new Error('GetAll error'));
    });
    test('then we should get with error', async () => {
      await usersController.get(mockRequest, mockResponse, mockNext);
      expect(mockRepo.get).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(new Error('Get error'));
    });
    test('then we should post with error', async () => {
      await usersController.post(mockRequest, mockResponse, mockNext);
      expect(mockRepo.post).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(new Error('Post error'));
    });
    test('then we should patch with error', async () => {
      await usersController.patch(mockRequest, mockResponse, mockNext);
      expect(mockRepo.patch).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(new Error('Patch error'));
    });
    test('then we should delete with error', async () => {
      await usersController.delete(mockRequest, mockResponse, mockNext);
      expect(mockRepo.delete).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(new Error('Delete error'));
    });
    test('then we should login error', async () => {
      await usersController.login(mockRequest, mockResponse, mockNext);
      expect(mockRepo.search).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(new Error('Search error'));
    });
    test('then we should login with search error', async () => {
      const mockData = [
        {
          id: '1',
          userName: '',
          password: '',
        },
      ] as unknown as User;
      (mockRepo.search as jest.Mock).mockResolvedValueOnce([]);

      const mockRequest = {
        params: { id: '1' },
        body: { userName: '', password: '' },
      } as unknown as Request;

      const mockResponse = {
        json: jest.fn().mockResolvedValueOnce(mockData),
        status: jest.fn(),
      } as unknown as Response;

      const mockNext = jest.fn().mockResolvedValue(new Error()) as NextFunction;

      Auth.compare = jest.fn().mockResolvedValueOnce(false);

      await usersController.login(mockRequest, mockResponse, mockNext);

      expect(mockRepo.search).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(new Error('Login unauthorized'));
    });
    test('should call login with password error and return error', async () => {
      const mockRequest = {
        body: { username: 'Rodrigo', password: 'Rodrigo' },
      } as Request;

      (mockRepo.search as jest.Mock).mockResolvedValueOnce([
        {
          userName: '',
          password: '',
        } as unknown as Promise<User>,
      ]);

      await usersController.login(mockRequest, mockResponse, mockNext);
      expect(mockRepo.search).toHaveBeenCalled();
      (mockRepo.search as jest.Mock).mockRejectedValueOnce(
        new Error('GetAll Error')
      );
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
