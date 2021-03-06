import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
} from '@nestjs/common';

import { TeacherService } from './teacher.service';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {
  }

  @Get()
  getTeacher() {
    return this.teacherService.findTeacher();
  }

  @Post('class')
  async addClass(
    @Body('dayIndex') dayIndex: number,
    @Body('start') start: number,
    @Body('end') end: number,
  ) {
    return await this.teacherService.insertClass(
      dayIndex,
      start,
      end,
    );
  }

  @Patch('hour')
  async updateHours(
    @Body('dayIndex') dayIndex: number,
    @Body('hourIndex') hourIndex: number,
  ) {
    return await this.teacherService.hourToggle(dayIndex, hourIndex);
  }

  @Post('reset')
  async reset() {
    return await this.teacherService.reset();
  }
}
