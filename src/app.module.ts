import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeacherModule } from './teacher/teacher.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URL || 'mongodb://localhost:27017/create_learn'),
    TeacherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
