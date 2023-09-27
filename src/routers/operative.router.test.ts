import { OperativeController } from '../controller/operative.controller';
import { FilesInterceptor } from '../middleware/files.interceptor';
import { OperativeRouter } from './operative.router';

describe('Given UsersRouter', () => {
  describe('When we instantiate it', () => {
    jest.spyOn(Function.prototype, 'bind');
    const controllerOperative = {
      getAll: jest.fn(),
      get: jest.fn(),
      create: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      getCommandOperatives: jest.fn(),
    } as unknown as OperativeController;
    controllerOperative.updateOperativeWhithImg = jest.fn();
    controllerOperative.deleteOperativeAndUpdate = jest.fn();
    const filesOperative: FilesInterceptor = new FilesInterceptor();
    filesOperative.singleFileStore = jest.fn().mockReturnValue(() => {});
    const routerOperative = new OperativeRouter(
      controllerOperative,
      filesOperative
    );
    test('Then it should ...', () => {
      expect(routerOperative).toBeInstanceOf(OperativeRouter);
      expect(Function.prototype.bind).toHaveBeenCalledTimes(12);
    });
  });
});
