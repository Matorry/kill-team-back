import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { CommandController } from './controller/command.controller.js';
import { OperativeController } from './controller/operative.controller.js';
import { UsersController } from './controller/user.controller.js';
import { Command } from './entities/command.js';
import { Operative } from './entities/operative.js';
import { User } from './entities/user.js';
import { ErrorMiddleware } from './middleware/error.middleware.js';
import { FilesInterceptor } from './middleware/files.interceptor.js';
import { CommandMongoRepository } from './repository/command.mongo.repository.js';
import { OperativeMongoRepository } from './repository/operative.mongo.repository.js';
import { Repository } from './repository/repository.js';
import { UserMongoRepository } from './repository/user.mongo.repository.js';
import { CommandRouter } from './routers/command.router.js';
import { OperativeRouter } from './routers/operative.router.js';
import { UsersRouter } from './routers/user.router.js';
import { HttpError } from './types/http.error.js';

export const app = express();

app.use(morgan('dev'));
app.use(cors());

app.use(express.json());
app.use(express.static('public'));

const filesInterceptor = new FilesInterceptor();

const userRepo: Repository<User> = new UserMongoRepository();
const userController: UsersController = new UsersController(userRepo);
const userRouter = new UsersRouter(userController);

const commandRepo: Repository<Command> = new CommandMongoRepository();
const commandController: CommandController = new CommandController(commandRepo);
const commandRouter = new CommandRouter(commandController, filesInterceptor);

const operativeRepo: Repository<Operative> = new OperativeMongoRepository();
const operativeController: OperativeController = new OperativeController(
  operativeRepo
);
const operativeRouter = new OperativeRouter(
  operativeController,
  filesInterceptor
);

app.use('/users', userRouter.router);
app.use('/command', commandRouter.routerCommand);
app.use('/operative', operativeRouter.routerOperative);

app.use('/:id', (req: Request, res: Response, next: NextFunction) => {
  const error = new HttpError(400, 'Bad request', 'Invalid route');
  next(error);
});

const errorMiddleware = new ErrorMiddleware();
app.use(errorMiddleware.manageErrors.bind(errorMiddleware));
