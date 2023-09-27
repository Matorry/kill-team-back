import { Schema, model } from 'mongoose';
import { Command } from '../entities/command.js';

const commandSchema = new Schema<Command>({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  faction: {
    type: String,
    required: true,
  },
  operatives: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Operative',
      required: true,
    },
  ],
  size: {
    type: String,
    required: true,
  },
  imageData: {
    type: {
      publicId: { type: String },
      width: { type: Number },
      height: { type: Number },
      format: { type: String },
      url: { type: String },
    },
  },
});

commandSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const CommandModel = model('Command', commandSchema, 'commands');
