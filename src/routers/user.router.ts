/* eslint-disable no-unused-vars */

import express, { Router as createRouter } from 'express';
import { UsersController } from '../controller/user.controller.js';

import { AuthInterceptor } from '../middleware/auth.interceptor.js';

export class UsersRouter {
  router: express.Router;

  authInterceptor: AuthInterceptor;

  constructor(private controller: UsersController) {
    this.router = createRouter();
    this.authInterceptor = new AuthInterceptor();
    this.configure();
  }

  configure() {
    this.router.patch('/login', this.controller.login.bind(this.controller));
    this.router.post('/register', this.controller.post.bind(this.controller));

    this.router.get('/', this.controller.getAll.bind(this.controller));
    this.router.get('/:id', this.controller.get.bind(this.controller));
  }
}
