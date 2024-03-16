import { Test, TestingModule } from '@nestjs/testing';
import { GetParamsService } from './get-params.service';

describe('GetParamsServiceService', () => {
  let service: GetParamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetParamsService],
    }).compile();

    service = module.get<GetParamsService>(GetParamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
