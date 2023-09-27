import { NextFunction, Request, Response } from 'express';
import { Command } from '../entities/command.js';
import { Operative } from '../entities/operative.js';
import { User } from '../entities/user.js';
import { CommandMongoRepository } from '../repository/command.mongo.repository.js';
import { OperativeMongoRepository } from '../repository/operative.mongo.repository.js';
import { UserMongoRepository } from '../repository/user.mongo.repository.js';
import { CloudinaryService } from '../services/mediaFiles.js';
import { HttpError } from '../types/http.error.js';
import { Controller } from './controller.js';

export class CommandController extends Controller<Operative | Command> {
  cloudinary: CloudinaryService;
  constructor(protected repo: CommandMongoRepository) {
    super(repo);
    this.cloudinary = new CloudinaryService();
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new HttpError(
          400,
          'Bad Request',
          'No avatar image for the command'
        );
      }

      const finalPath = req.file.destination + '/' + req.file.filename;
      const imageData = await this.cloudinary.uploadImage(finalPath);
      req.body.imageData = imageData;
      const userRepo = new UserMongoRepository();
      const command = await this.repo.post(req.body);
      const user: User | null = await userRepo.get(req.body.author);

      user.comands.push(command);
      await userRepo.patch(req.body.author, user);

      res.json(command);
    } catch (error) {
      next(error);
    }
  }

  async updateCommandWhithImg(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new HttpError(
          400,
          'Bad Request',
          'No avatar image for the command'
        );
      }

      const finalPath = req.file.destination + '/' + req.file.filename;
      const imageData = await this.cloudinary.uploadImage(finalPath);
      req.body.imageData = imageData;
      await this.repo.patch(req.body.id, req.body);
      res.json(req.body);
    } catch (error) {
      next(error);
    }
  }

  async deleteCommandAndUpdate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const operativeRepo = new OperativeMongoRepository();
      const userRepo = new UserMongoRepository();
      const command = await this.repo.get(req.body.id);
      await this.repo.delete(req.body.id);

      const user: User = await userRepo.get(command.author.id);
      user.comands = user.comands.filter(
        (element) => element.id !== command.id
      );
      await userRepo.patch(user.id, user);

      command.operatives.forEach(async (operative) => {
        await operativeRepo.delete(operative.id);
      });
      res.json();
    } catch (error) {
      next(error);
    }
  }

  async getUserCommands(req: Request, res: Response, next: NextFunction) {
    try {
      const allCommands = await this.repo.getAll();
      const userComands = allCommands.filter(
        (command) =>
          (command.author.id as unknown as Buffer).toString('hex') ===
          req.body.validatedId
      );
      res.json(userComands);
    } catch (error) {
      next(error);
    }
  }
}
