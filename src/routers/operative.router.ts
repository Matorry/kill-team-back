/* eslint-disable no-unused-vars */

import express, { Router as createRouter } from 'express';
import { OperativeController } from '../controller/operative.controller.js';

import { AuthInterceptor } from '../middleware/auth.interceptor.js';
import { FilesInterceptor } from '../middleware/files.interceptor.js';
import { OperativeMongoRepository } from '../repository/operative.mongo.repository.js';

export class OperativeRouter {
  routerOperative: express.Router;
  repoOperative: OperativeMongoRepository;
  authInterceptor: AuthInterceptor;

  constructor(
    private controller: OperativeController,
    private filesInterceptor: FilesInterceptor
  ) {
    this.repoOperative = new OperativeMongoRepository();
    this.routerOperative = createRouter();
    this.authInterceptor = new AuthInterceptor();
    this.configure();
  }

  configure() {
    this.routerOperative.post(
      '/',
      this.authInterceptor.authorization.bind(this.authInterceptor),
      this.filesInterceptor.singleFileStore('imageData'),
      this.controller.create.bind(this.controller)
    );
    this.routerOperative.patch(
      '/img/:id',
      this.authInterceptor.authorization.bind(this.authInterceptor),
      this.filesInterceptor.singleFileStore('imageData'),
      this.controller.updateOperativeWhithImg.bind(this.controller)
    );
    this.routerOperative.patch(
      '/noimg/:id',
      this.authInterceptor.authorization.bind(this.authInterceptor),
      this.controller.patch.bind(this.controller)
    );
    this.routerOperative.delete(
      '/:id',
      this.authInterceptor.authorization.bind(this.authInterceptor),
      this.controller.deleteOperativeAndUpdate.bind(this.controller)
    );
    this.routerOperative.get(
      '/get/:id',
      this.authInterceptor.authorization.bind(this.authInterceptor),
      this.controller.getCommandOperatives.bind(this.controller)
    );
    this.routerOperative.get(
      '/:id',
      this.authInterceptor.authorization.bind(this.authInterceptor),
      this.controller.get.bind(this.controller)
    );
  }
}
