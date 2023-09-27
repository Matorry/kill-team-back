import { CommandController } from '../controller/command.controller';
import { FilesInterceptor } from '../middleware/files.interceptor';

import { CommandRouter } from './command.router';

describe('Given UsersRouter', () => {
  describe('When we instantiate it', () => {
    jest.spyOn(Function.prototype, 'bind');
    const controllerCommand = {
      getAll: jest.fn(),
      get: jest.fn(),
      create: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      getUserCommands: jest.fn(),
    } as unknown as CommandController;
    controllerCommand.deleteCommandAndUpdate = jest.fn();
    controllerCommand.updateCommandWhithImg = jest.fn();
    const filesCommand: FilesInterceptor = new FilesInterceptor();
    filesCommand.singleFileStore = jest.fn().mockReturnValue(() => {});
    const routerCommand = new CommandRouter(controllerCommand, filesCommand);
    test('Then it should ...', () => {
      expect(routerCommand).toBeInstanceOf(CommandRouter);
      expect(Function.prototype.bind).toHaveBeenCalledTimes(12);
    });
  });
});
