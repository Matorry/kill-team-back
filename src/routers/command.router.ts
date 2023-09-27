/* eslint-disable no-unused-vars */

import express, { Router as createRouter } from 'express';
import { CommandController } from '../controller/command.controller';

import { AuthInterceptor } from '../middleware/auth.interceptor.js';
import { FilesInterceptor } from '../middleware/files.interceptor.js';
import { CommandMongoRepository } from '../repository/command.mongo.repository.js';

export class CommandRouter {
  routerCommand: express.Router;
  repoCommand: CommandMongoRepository;
  authInterceptor: AuthInterceptor;

  constructor(
    private controller: CommandController,
    private filesInterceptor: FilesInterceptor
  ) {
    this.repoCommand = new CommandMongoRepository();
    this.routerCommand = createRouter();
    this.authInterceptor = new AuthInterceptor();
    this.configure();
  }

  configure() {
    this.routerCommand.get(
      '/',
      this.authInterceptor.authorization.bind(this.authInterceptor),
      this.controller.getUserCommands.bind(this.controller)
    );
    this.routerCommand.post(
      '/',
      this.authInterceptor.authorization.bind(this.authInterceptor),
      this.filesInterceptor.singleFileStore('imageData'),
      this.controller.create.bind(this.controller)
    );
    this.routerCommand.patch(
      '/img/:id',
      this.authInterceptor.authorization.bind(this.authInterceptor),
      this.filesInterceptor.singleFileStore('imageData'),
      this.controller.updateCommandWhithImg.bind(this.controller)
    );
    this.routerCommand.patch(
      '/noimg/:id',
      this.authInterceptor.authorization.bind(this.authInterceptor),
      this.controller.patch.bind(this.controller)
    );
    this.routerCommand.delete(
      '/:id',
      this.authInterceptor.authorization.bind(this.authInterceptor),
      this.controller.deleteCommandAndUpdate.bind(this.controller)
    );
    this.routerCommand.get(
      '/:id',
      this.authInterceptor.authorization.bind(this.authInterceptor),
      this.controller.get.bind(this.controller)
    );
  }
}
