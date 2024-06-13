import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { platform } from 'os';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OnboardingService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async getToken(code: string, email: string) {
    const userMain = await this.prismaService.userMain.findFirst({
      where: {
        verificationToken: code,
        email: email,
      },
      include: {
        mainCompany: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!userMain) {
      throw new Error('User not found');
    }
    const payload = {
      data: {
        id: userMain.id,
        email: userMain.email,
        name: userMain.name,
        role: userMain.role,
        mainCompany: userMain.mainCompany,
        currentCompany: userMain.mainCompany.id,
        tokenFor: 'onboarding',
      },
    };
    const token = await this.jwtService.sign(payload);
    const user = {
      id: userMain.id,
      email: userMain.email,
      name: userMain.name,
      role: userMain.role,
      mainCompany: userMain.mainCompany,
      currentCompany: userMain.mainCompany.id,
      tokenFor: 'onboarding',
    };
    return { user, token };
  }
}
