import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Teacher } from './teacher.model';

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel('Teacher') private readonly teacherModel: Model<Teacher>,
  ) {
  }

  async insertProduct(title: string, desc: string, price: number) {
    const newProduct = new this.teacherModel({
      title,
      description: desc,
      price,
    });
    const result = await newProduct.save();
    return result.id as string;
  }

  async getProducts() {
    const products = await this.teacherModel.find().exec();
    return products.map(prod => ({
      id: prod.id,
      title: prod.title,
      description: prod.description,
      price: prod.price,
    }));
  }

  async getSingleProduct(productId: string) {
    const product = await this.findProduct(productId);
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
    };
  }

  async updateProduct(
    productId: string,
    title: string,
    desc: string,
    price: number,
  ) {
    const updatedProduct = await this.findProduct(productId);
    if (title) {
      updatedProduct.title = title;
    }
    if (desc) {
      updatedProduct.description = desc;
    }
    if (price) {
      updatedProduct.price = price;
    }
    // updatedProduct.save();
  }

  async updateHour(
    teacherId: string,
    dayIndex: number,
    hourIndex: number,
  ) {

    const updatedTeacher = await this.teacherModel.findByIdAndUpdate(
      teacherId, { $set: { [`hours.${dayIndex}.${hourIndex}`]: true } }, { useFindAndModify: false },
    );
    const foundTeacher = await this.findTeacher(teacherId);
    if (updatedTeacher && foundTeacher) {
      return { updated: true };
    } else {
      return { updated: false };
    }
  }

  async deleteProduct(prodId: string) {
    const result = await this.teacherModel.deleteOne({ _id: prodId }).exec();
    if (result.n === 0) {
      throw new NotFoundException('Could not find product.');
    }
  }

  private async findProduct(id: string): Promise<Teacher> {
    let product;
    try {
      product = await this.teacherModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find product.');
    }
    if (!product) {
      throw new NotFoundException('Could not find product.');
    }
    return product;
  }

  private async findTeacher(id: string): Promise<Teacher> {
    let teacher;
    try {
      teacher = await this.teacherModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find teacher.');
    }
    if (!teacher) {
      throw new NotFoundException('Could not find teacher.');
    }
    return teacher;
  }
}
