import { Schema, model } from 'mongoose';
import { Operative } from '../entities/operative.js';

const operativeSchema = new Schema<Operative>({
  command: {
    type: Schema.Types.ObjectId,
    ref: 'Command',
    required: true,
  },
  name: {
    type: String,
    unique: true,
    required: true,
  },
  operativeType: {
    type: String,
    required: true,
  },
  faction: {
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
  moviment: {
    type: String,
    required: true,
  },
  actionPointLimit: {
    type: String,
    required: true,
  },
  groupActivation: {
    type: String,
    required: true,
  },
  defence: {
    type: String,
    required: true,
  },
  save: {
    type: String,
    required: true,
  },
  wounds: {
    type: String,
    required: true,
  },
});

operativeSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const OperativeModel = model('Operative', operativeSchema, 'operatives');
