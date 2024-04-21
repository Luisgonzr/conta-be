import { Module } from '@nestjs/common';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [PlanController],
  providers: [PlanService],
  imports: [HttpModule, PrismaModule],
})
export class PlanModule {}
