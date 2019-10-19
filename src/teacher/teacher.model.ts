import * as mongoose from 'mongoose';

export const TeacherSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  hours: { type: Array, required: true },
});

export interface Teacher extends mongoose.Document {
  id: string;
  title: string;
  description: string;
  price: number;
  hours: any;
}
