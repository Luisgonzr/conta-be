import { Test, TestingModule } from '@nestjs/testing';
import { FacturapiErrorHandlerService } from './facturapi-error-handler.service';

describe('FacturapiErrorHandlerService', () => {
  let service: FacturapiErrorHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FacturapiErrorHandlerService],
    }).compile();

    service = module.get<FacturapiErrorHandlerService>(FacturapiErrorHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
