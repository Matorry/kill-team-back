import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { HttpError } from '../types/http.error';
import { ErrorMiddleware } from './error.middleware';

describe('Given ErrorMiddleware class', () => {
  describe('When we instantiate it', () => {
    const errorMiddleware = new ErrorMiddleware();
    const mockRequest = {} as Request;
    const mockResponse = {
      status: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;
    const mockNext = jest.fn();
    test('Then manageError should be used with Error', () => {
      const error = new Error('Test Error');
      errorMiddleware.manageErrors(error, mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'Server Error',
        })
      );
    });

    test('Then manageError should be used with HttpError', () => {
      const error = new HttpError(400, 'Bad Request', 'Test HttpError');
      errorMiddleware.manageErrors(error, mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'Http Error',
        })
      );
    });
    test('CastError option', () => {
      const error = new mongoose.Error.CastError('400', '', '');
      const mockResponse = {
        status: jest.fn().mockResolvedValueOnce(400),
        json: jest.fn(),
        statusMessage: 'Bad Request',
      } as unknown as Response;
      errorMiddleware.manageErrors(error, mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.statusMessage).toEqual('Bad Request');
    });
    test('MongoServerError option', () => {
      const error = new mongoose.mongo.MongoServerError({});
      const mockResponse = {
        status: jest.fn().mockResolvedValueOnce(400),
        json: jest.fn(),
        statusMessage: 'Bad Request',
      } as unknown as Response;
      errorMiddleware.manageErrors(error, mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.statusMessage).toEqual('Not accepted');
    });
    test('ValidationError option', () => {
      const error = new mongoose.Error.ValidationError();
      const mockResponse = {
        status: jest.fn().mockResolvedValueOnce(400),
        json: jest.fn(),
        statusMessage: 'Bad Request',
      } as unknown as Response;
      errorMiddleware.manageErrors(error, mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.statusMessage).toEqual('Bad Request');
    });
    test('else option', () => {
      const error = {
        status: 500,
        name: 'Error Test',
        message: 'Server error',
      };
      const mockResponse = {
        status: jest.fn().mockResolvedValueOnce(400),
        json: jest.fn().mockResolvedValueOnce(error),
        statusMessage: 'Bad request',
      } as unknown as Response;
      errorMiddleware.manageErrors(error, mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(error.status);
    });
  });
});
