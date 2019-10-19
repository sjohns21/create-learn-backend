import { BadRequestException, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('json')
  getJson(): any {
    // throw new BadRequestException();
    return { updated: true };
  }
}
