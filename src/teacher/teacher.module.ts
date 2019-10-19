import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { ProductSchema } from './teacher.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  ],
  controllers: [TeacherController],
  providers: [TeacherService],
})
export class TeacherModule {
}
