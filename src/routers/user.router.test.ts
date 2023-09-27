import { UsersController } from '../controller/user.controller';

import { UsersRouter } from './user.router';

describe('Given UsersRouter', () => {
  describe('When we instantiate it', () => {
    jest.spyOn(Function.prototype, 'bind');
    const controller = {
      getAll: jest.fn(),
      get: jest.fn(),
      login: jest.fn(),
      post: jest.fn(),
    } as unknown as UsersController;

    const router = new UsersRouter(controller);
    test('Then it should ...', () => {
      expect(router).toBeInstanceOf(UsersRouter);
      expect(Function.prototype.bind).toHaveBeenCalledTimes(4);
    });
  });
});
