import { Test, TestingModule } from '@nestjs/testing';
import { ForgotPasswordEmailService } from './forgot-password-email.service';

describe('ForgotPasswordEmailService', () => {
  let service: ForgotPasswordEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ForgotPasswordEmailService],
    }).compile();

    service = module.get<ForgotPasswordEmailService>(ForgotPasswordEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
