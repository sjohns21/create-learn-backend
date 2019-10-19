import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { TeacherSchema } from './teacher.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Teacher', schema: TeacherSchema }]),
  ],
  controllers: [TeacherController],
  providers: [TeacherService],
})
export class TeacherModule {
}
