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

  // async insertProduct(title: string, desc: string, price: number) {
  //   const newProduct = new this.teacherModel({
  //     title,
  //     description: desc,
  //     price,
  //   });
  //   const result = await newProduct.save();
  //   return result.id as string;
  // }

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

  //
  // async getProducts() {
  //   const products = await this.teacherModel.find().exec();
  //   return products.map(prod => ({
  //     id: prod.id,
  //     title: prod.title,
  //     description: prod.description,
  //     price: prod.price,
  //   }));
  // }

  // async getSingleProduct(productId: string) {
  //   const product = await this.findProduct(productId);
  //   return {
  //     id: product.id,
  //     title: product.title,
  //     description: product.description,
  //     price: product.price,
  //   };
  // }

  // async updateProduct(
  //   productId: string,
  //   title: string,
  //   desc: string,
  //   price: number,
  // ) {
  //   const updatedProduct = await this.findProduct(productId);
  //   if (title) {
  //     updatedProduct.title = title;
  //   }
  //   if (desc) {
  //     updatedProduct.description = desc;
  //   }
  //   if (price) {
  //     updatedProduct.price = price;
  //   }
  //   // updatedProduct.save();
  // }

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

  // async deleteProduct(prodId: string) {
  //   const result = await this.teacherModel.deleteOne({ _id: prodId }).exec();
  //   if (result.n === 0) {
  //     throw new NotFoundException('Could not find product.');
  //   }
  // }

  // private async findProduct(id: string): Promise<Teacher> {
  //   let product;
  //   try {
  //     product = await this.teacherModel.findById(id).exec();
  //   } catch (error) {
  //     throw new NotFoundException('Could not find product.');
  //   }
  //   if (!product) {
  //     throw new NotFoundException('Could not find product.');
  //   }
  //   return product;
  // }

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
}
