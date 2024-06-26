import { Module } from '@nestjs/common';
import { TaxCatalogController } from './tax-catalog.controller';
import { TaxCatalogService } from './tax-catalog.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SharedModule } from 'src/shared/shared.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { MexicoInvoicingRulesService } from 'src/shared/mexico-invoicing-rules/mexico-invoicing-rules.service';

@Module({
  controllers: [TaxCatalogController],
  providers: [TaxCatalogService, JwtStrategy, MexicoInvoicingRulesService],
  imports: [
    PrismaModule,
    SharedModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ],
})
export class TaxCatalogModule { }
