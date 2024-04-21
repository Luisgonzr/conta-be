import { Controller, Get, Param, Put } from '@nestjs/common';
import { PlanService } from './plan.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('plan')
export class PlanController {
  constructor(private planService: PlanService) {}

  @Public()
  @Get()
  async getPlans() {
    return await this.planService.getPlans();
  }

  @Public()
  @Put('sync-stripe-plan/:planId')
  async syncStripePlan(@Param('planId') planId: string) {
    return await this.planService.syncStripePlan(planId);
  }
}
