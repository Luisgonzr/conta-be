import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { QueryBuilderService } from './query-builder/query-builder.service';

@Module({
  exports: [PrismaService],
  providers: [PrismaService, QueryBuilderService],
})
export class PrismaModule {}
