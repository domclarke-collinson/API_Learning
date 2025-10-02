import { Test, TestingModule } from '@nestjs/testing';
import { MembershipController } from './membership.controller';
import { MembershipService } from './membership.service';

describe('MembershipController', () => {
  let controller: MembershipController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MembershipController],
      providers: [MembershipService],
    }).compile();

    controller = app.get<MembershipController>(MembershipController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(controller.getHello()).toBe('Hello World!');
    });
  });
});


// What is this file used for??? 
