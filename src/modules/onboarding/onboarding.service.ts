import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SetPasswordDto } from './dtos/set-password.dto';
import { SetCompanyDto, SetTaxProfileDto } from './dtos';
import { OnboardingUserNotFoundException } from 'src/common/exceptions/auth.onboarding-user-not-found.exception';
import * as argon2 from 'argon2';

@Injectable()
export class OnboardingService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async getToken(code: string, email: string) {
    const userMain = await this.prismaService.userMain
      .findFirst({
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
      })
      .catch((error) => {
        console.log(error);
      });
    if (!userMain) {
      throw new OnboardingUserNotFoundException();
    }
    const payload = {
      data: {
        id: userMain.id,
        email: userMain.email,
        name: userMain.name,
        role: userMain.role,
        mainCompany: userMain.mainCompany,
        currentCompany: userMain.mainCompany.id,
      },
    };
    const token = await this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_ONBOARDING,
    });
    const user = {
      id: userMain.id,
      email: userMain.email,
      name: userMain.name,
      role: userMain.role,
      mainCompany: userMain.mainCompany,
      currentCompany: userMain.mainCompany.id,
    };
    return { user, token };
  }

  async setPassword(setPasswordDto: SetPasswordDto, userId: string) {
    const userMain = await this.prismaService.userMain.findUnique({
      where: {
        id: userId,
      },
    });
    if (!userMain) {
      throw new Error('User not found');
    }
    const passwordHash = await argon2.hash(setPasswordDto.password);
    const user = await this.prismaService.userMain.update({
      where: {
        id: userMain.id,
      },
      data: {
        name: setPasswordDto.name,
        password: passwordHash,
        verificationToken: null,
        verificationDeadline: null,
        isVerified: true,
      },
    });
    return user;
  }
  async setCompany(setCompanyDto: SetCompanyDto, companyId: string) {
    const company = await this.prismaService.company.update({
      where: {
        id: companyId,
      },
      data: {
        name: setCompanyDto.name,
        activityDescription: setCompanyDto.activityDescription,
      },
    });
    return company;
  }
  async setTaxProfile(taxProfileDto: SetTaxProfileDto, companyId: string) {
    const taxProfile = await this.prismaService.companyTaxProfile.create({
      data: {
        ...taxProfileDto,
        company: {
          connect: {
            id: companyId,
          },
        },
      },
    });
    return taxProfile;
  }
}
