import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { TeacherService } from './teacher.service';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {
  }

  @Post()
  async addProduct(
    @Body('title') prodTitle: string,
    @Body('description') prodDesc: string,
    @Body('price') prodPrice: number,
  ) {
    const generatedId = await this.teacherService.insertProduct(
      prodTitle,
      prodDesc,
      prodPrice,
    );
    return { id: generatedId };
  }

  @Get()
  async getAllProducts() {
    const products = await this.teacherService.getProducts();
    return products;
  }

  @Get(':id')
  getProduct(@Param('id') prodId: string) {
    return this.teacherService.getSingleProduct(prodId);
  }

  // @Patch(':id')
  // async updateProduct(
  //   @Param('id') prodId: string,
  //   @Body('title') prodTitle: string,
  //   @Body('description') prodDesc: string,
  //   @Body('price') prodPrice: number,
  // ) {
  //   await this.teacherService.updateProduct(prodId, prodTitle, prodDesc, prodPrice);
  //   return null;
  // }

  @Patch('hour')
  async updateHours(
    @Body('teacherId') teacherId: string,
    @Body('dayIndex') dayIndex: number,
    @Body('hourIndex') hourIndex: number,
  ) {
    await this.teacherService.updateHour(teacherId, dayIndex, hourIndex);
    return null;
  }

  @Delete(':id')
  async removeProduct(@Param('id') prodId: string) {
    await this.teacherService.deleteProduct(prodId);
    return null;
  }
}
