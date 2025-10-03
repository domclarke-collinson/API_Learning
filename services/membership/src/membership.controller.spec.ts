import { Test, TestingModule } from '@nestjs/testing';
import { MembershipController } from './membership.controller';
import { MembershipService } from './membership.service';

describe('MembershipController', () => {
  let controller: MembershipController;
  let service: MembershipService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MembershipController],
      providers: [MembershipService],
    }).compile();

    controller = app.get<MembershipController>(MembershipController);
    service = app.get<MembershipService>(MembershipService);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(controller.getHello()).toBe('Hello World!');
    });

    it('should call membershipService.getHello()', () => {
      // Spy on the service method
      const getHelloSpy = jest.spyOn(service, 'getHello');

      // Call the controller method
      controller.getHello();

      // Verify the service method was called
      expect(getHelloSpy).toHaveBeenCalled();
      expect(getHelloSpy).toHaveBeenCalledTimes(1);
    });
  });
});