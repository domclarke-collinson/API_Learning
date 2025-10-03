import { Body, Controller, Get, Post} from '@nestjs/common';
import { MembershipService } from './membership.service';
import { createUser } from './membership.dto';

@Controller()
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Get()
  getHello(): string {
    return this.membershipService.getHello();
  }
  @Post('/user')
  createUser(@Body() body: createUser) {
    return body;
  }
}