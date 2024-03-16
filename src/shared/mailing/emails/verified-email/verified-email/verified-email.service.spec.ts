import { Test, TestingModule } from '@nestjs/testing';
import { VerifiedEmailService } from './verified-email.service';

describe('VerifiedEmailService', () => {
  let service: VerifiedEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VerifiedEmailService],
    }).compile();

    service = module.get<VerifiedEmailService>(VerifiedEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
