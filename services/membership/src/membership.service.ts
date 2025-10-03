import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from './membership.entity';
import { createUser } from './membership.dto';

@Injectable()
export class MembershipService {
  getHello(): string {
    return 'Hello World!';
  }
  
}