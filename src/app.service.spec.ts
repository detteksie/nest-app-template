import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from './app.service';

describe('UsersService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(service.getHello()).toBe('Hello World!');
    });

    it('should return "Bye World!"', () => {
      expect(service.getBye()).toBe('Bye World!');
    });
  });
});
