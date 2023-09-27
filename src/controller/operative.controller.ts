import { NextFunction, Request, Response } from 'express';
import { Command } from '../entities/command.js';
import { Operative } from '../entities/operative.js';
import { CommandMongoRepository } from '../repository/command.mongo.repository.js';
import { OperativeMongoRepository } from '../repository/operative.mongo.repository.js';
import { CloudinaryService } from '../services/mediaFiles.js';
import { HttpError } from '../types/http.error.js';
import { Controller } from './controller.js';

export class OperativeController extends Controller<Operative | Command> {
  cloudinary: CloudinaryService;
  constructor(protected repo: OperativeMongoRepository) {
    super(repo);
    this.cloudinary = new CloudinaryService();
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new HttpError(
          400,
          'Bad Request',
          'No avatar image for the operative'
        );
      }

      const finalPath = req.file.destination + '/' + req.file.filename;
      const imageData = await this.cloudinary.uploadImage(finalPath);
      req.body.imageData = imageData;
      const commandRepo = new CommandMongoRepository();

      const operative = await this.repo.post(req.body);

      const command: Command | null = await commandRepo.get(req.body.command);

      command.operatives.push(operative);
      await commandRepo.patch(req.body.command, command);

      res.json(operative);
    } catch (error) {
      next(error);
    }
  }

  async updateOperativeWhithImg(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.file) {
        throw new HttpError(
          400,
          'Bad Request',
          'No avatar image for the operative'
        );
      }

      const finalImgPath = req.file.destination + '/' + req.file.filename;
      const image = await this.cloudinary.uploadImage(finalImgPath);
      req.body.imageData = image;
      await this.repo.patch(req.body.id, req.body);
      res.json(req.body);
    } catch (error) {
      next(error);
    }
  }

  async deleteOperativeAndUpdate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const commandRepo = new CommandMongoRepository();
      const operative = await this.repo.get(req.body.id);
      this.repo.delete(req.body.id);
      const command: Command = await commandRepo.get(operative.command.id);

      command.operatives = command.operatives.filter(
        (command) => command.id !== req.body.id
      );
      await commandRepo.patch(command.id, command);

      res.json();
    } catch (error) {
      next(error);
    }
  }

  async getCommandOperatives(req: Request, res: Response, next: NextFunction) {
    try {
      const commandId = req.params.id;

      const allOperatives = await this.repo.getAll();

      const commandOperatives = allOperatives.filter(
        (operative) =>
          commandId ===
          (operative.command.id as unknown as Buffer).toString('hex')
      );
      res.json(commandOperatives);
    } catch (error) {
      next(error);
    }
  }
}
