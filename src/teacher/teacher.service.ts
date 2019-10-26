import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Teacher } from './teacher.model';

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel('Teacher') private readonly teacherModel: Model<Teacher>,
  ) {
  }

  async findTeacher(): Promise<Teacher> {
    let teacher;
    try {
      teacher = await this.teacherModel.findOne().exec();
    } catch (error) {
      throw new NotFoundException('Could not find teacher.');
    }
    if (!teacher) {
      throw new NotFoundException('Could not find teacher.');
    }
    return teacher;
  }

  async insertClass(dayIndex: number, start: number, end: number) {
    if (start > end) {
      throw new BadRequestException();
    }
    const teacherBefore = await this.findTeacher();
    const day = teacherBefore.hours[dayIndex];

    let windowIsAvailable = true;
    if (dayIndex >= 0 && dayIndex <= 6) {
      for (let hour = start; hour <= end; hour++) {
        const status = day[hour];
        if (status === 0 || status === 2) {
          windowIsAvailable = false;
          break;
        }
      }
    }
    if (windowIsAvailable) {
      for (let hour = start; hour <= end; hour++) {
        day[hour] = 2;
      }

      const updatedTeacher = await this.teacherModel.findOneAndUpdate(
        {}, { $set: { [`hours.${dayIndex}`]: day } }, { useFindAndModify: false },
      );
      const teacherAfter = await this.findTeacher();
      if (updatedTeacher && teacherAfter) {
        return { classAdded: true };
      } else {
        return { classAdded: false };
      }
    } else {
      return { classAdded: false };
    }

  }

  async hourToggle(
    dayIndex: number,
    hourIndex: number,
  ) {

    const teacherBefore = await this.findTeacher();
    const prevState = teacherBefore.hours[dayIndex][hourIndex];
    let newState;
    if (prevState === 0) {
      newState = 1;
    } else if (prevState === 1) {
      newState = 0;
    }
    const updatedTeacher = await this.teacherModel.findOneAndUpdate(
      {}, { $set: { [`hours.${dayIndex}.${hourIndex}`]: newState } }, { useFindAndModify: false },
    );
    const teacherAfter = await this.findTeacher();
    if (updatedTeacher && teacherAfter) {
      return { updated: true };
    } else {
      return { updated: false };
    }
  }

  async reset() {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = [];
      for (let j = 0; j < 24; j++) {
        day.push(0);
      }
      days.push(day);
    }
    await this.teacherModel.findOneAndUpdate(
      {}, { $set: { hours: days } }, { useFindAndModify: false },
    );
    const teacherAfter = await this.findTeacher();

    let resetSuccess = true;
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 24; j++) {
        if (teacherAfter.hours[i][j] !== 0) {
          resetSuccess = false;
          break;
        }
      }
    }
    if (resetSuccess) {
      return { reset: true };
    } else {
      return { reset: false };
    }

  }

}
