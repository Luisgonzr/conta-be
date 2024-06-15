import { Module } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingController } from './onboarding.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SharedModule } from 'src/shared/shared.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [OnboardingService],
  controllers: [OnboardingController],
  imports: [
    PrismaModule,
    SharedModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_ONBOARDING,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ],
})
export class OnboardingModule {}
