import { Test, TestingModule } from '@nestjs/testing';
import { SigninEmailService } from './signin-email.service';

describe('SigninEmailService', () => {
  let service: SigninEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SigninEmailService],
    }).compile();

    service = module.get<SigninEmailService>(SigninEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
