import { Test, TestingModule } from '@nestjs/testing';
import { FacturapiService } from './facturapi.service';

describe('FacturapiService', () => {
  let service: FacturapiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FacturapiService],
    }).compile();

    service = module.get<FacturapiService>(FacturapiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
