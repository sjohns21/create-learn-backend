import * as mongoose from 'mongoose';

export const TeacherSchema = new mongoose.Schema({
  hours: { type: Array, required: true },
});

export interface Teacher extends mongoose.Document {
  hours: any;
}
