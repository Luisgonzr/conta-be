import { Test, TestingModule } from '@nestjs/testing';
import { WelcomeEmailService } from './welcome-email.service';

describe('WelcomeEmailService', () => {
  let service: WelcomeEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WelcomeEmailService],
    }).compile();

    service = module.get<WelcomeEmailService>(WelcomeEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
