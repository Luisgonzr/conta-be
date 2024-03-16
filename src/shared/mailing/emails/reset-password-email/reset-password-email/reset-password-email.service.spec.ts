import { Test, TestingModule } from '@nestjs/testing';
import { ResetPasswordEmailService } from './reset-password-email.service';

describe('ResetPasswordEmailService', () => {
  let service: ResetPasswordEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResetPasswordEmailService],
    }).compile();

    service = module.get<ResetPasswordEmailService>(ResetPasswordEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
