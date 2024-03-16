import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForgotPasswordEmailService } from 'src/shared/mailing/emails/forgot-password-email/forgot-password-email/forgot-password-email.service';
import { ResetPasswordEmailService } from 'src/shared/mailing/emails/reset-password-email/reset-password-email/reset-password-email.service';
import { SigninEmailService } from 'src/shared/mailing/emails/signin-email/signin-email.service';
import { VerifiedEmailService } from 'src/shared/mailing/emails/verified-email/verified-email/verified-email.service';
import { UtilsService } from 'src/shared/utils/utils.service';
import {
  ForgotParams,
  LoginParams,
  RestoreParams,
  SigninParams,
  VerifyParams,
} from './interfaces';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  AuthUserNotFoundException,
  AuthUserNotVerifiedException,
  EmailTakenException,
  AuthWrongVerificatioNCodeException,
} from 'src/common/exceptions';
import { AuthMessages } from 'src/common/messages/auth.messages';
import { SigninResponseDto } from './dtos/response.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly utilsService: UtilsService,
    private signinEmailService: SigninEmailService,
    private verifiedEmailService: VerifiedEmailService,
    private forgotPasswordEmailService: ForgotPasswordEmailService,
    private resetPasswordEmailService: ResetPasswordEmailService,
    private configService: ConfigService,
  ) {}
  async login(loginData: LoginParams) {
    const userMain = await this.prismaService.userMain
      .findUnique({
        where: {
          email: loginData.email,
        },
        include: {
          mainCompany: {
            select: {
              id: true,
            },
          },
          secondaryCompanies: true,
        },
      })
      .catch((error) => {
        console.log(error);
      });
    if (!userMain) {
      throw new AuthUserNotFoundException();
    }
    if (userMain.isVerified === false) {
      throw new AuthUserNotVerifiedException();
    } else if (userMain.isActive === false) {
      throw new AuthUserNotFoundException();
    }
    const passwordValid = await argon2.verify(
      userMain.password,
      loginData.password,
    );
    if (!passwordValid) {
      throw new AuthUserNotFoundException();
    }
    let currentCompany = '';
    if (!userMain.mainCompany) {
      currentCompany = userMain.secondaryCompanies[0].companyId;
    } else {
      currentCompany = userMain.mainCompany.id;
    }
    const payload = {
      data: {
        id: userMain.id,
        email: userMain.email,
        name: userMain.name,
        role: userMain.role,
        mainCompany: currentCompany,
        currentCompany: currentCompany,
      },
    };
    const token = await this.jwtService.sign(payload);
    const user = {
      id: userMain.id,
      email: userMain.email,
      name: userMain.name,
      role: userMain.role,
      mainCompany: currentCompany,
      currentCompany: currentCompany,
    };
    return { user, token };
  }

  async signin(signinData: SigninParams) {
    const verificationToken = await this.utilsService.generateRandomString(32);
    const passwordHash = await argon2.hash(signinData.password);
    const userMain = await this.prismaService.userMain
      .create({
        data: {
          email: signinData.email,
          password: passwordHash,
          name: signinData.name,
          verificationToken: verificationToken,
          mainCompany: {
            create: {},
          },
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new EmailTakenException();
          }
        }
        throw error;
      });
    // SEND EMAIL
    const actionUrl = `${this.configService.get(
      'FRONTEND_URL',
    )}/auth/verify?email=${
      signinData.email
    }&verificationToken=${verificationToken}`;
    await this.signinEmailService
      .sendEmail(userMain.email, {
        name: userMain.name,
        actionUrl: actionUrl,
        verificationToken: verificationToken,
      })
      .catch((error) => {
        console.log(error);
      });
    return new SigninResponseDto(userMain);
  }

  async verify(verifyData: VerifyParams) {
    const userMain = await this.prismaService.userMain
      .findUnique({
        where: {
          email: verifyData.email,
        },
      })
      .catch((error) => {
        console.log(error);
      });
    if (!userMain) {
      throw new AuthUserNotFoundException();
    }
    if (userMain.verificationToken === verifyData.verificationToken) {
      await this.prismaService.userMain.update({
        where: {
          email: verifyData.email,
        },
        data: {
          isVerified: true,
          verificationToken: null,
        },
      });
      await this.verifiedEmailService.sendEmail(userMain.email, {
        userName: userMain.name,
      });
      return {
        message: AuthMessages.verify.good,
      };
    } else {
      throw new AuthWrongVerificatioNCodeException();
    }
  }

  async forgotPassword(forgotData: ForgotParams) {
    const userMain = await this.prismaService.userMain
      .findUnique({
        where: {
          email: forgotData.email,
        },
        select: {
          id: true,
          isVerified: true,
          isActive: true,
        },
      })
      .catch((error) => {
        console.log(error);
      });
    if (!userMain) {
      return {
        message: AuthMessages.forgotPassword.emailSent,
      };
    } else if (userMain.isVerified === true && userMain.isActive === true) {
      const passwordResetToken = await this.utilsService.generateRandomString(
        32,
      );
      const passwordResetExpires = this.utilsService.getExpirationDate(5);
      const addRestoreData = await this.prismaService.userMain
        .update({
          where: {
            id: userMain.id,
          },
          data: {
            passwordResetToken: passwordResetToken,
            passwordResetExpires: passwordResetExpires,
          },
        })
        .catch((error) => {
          console.log(error);
        });
      if (addRestoreData) {
        // SEND EMAIL
        const actionUrl = `${this.configService.get(
          'FRONTEND_URL',
        )}/auth/reset-password?email=${
          forgotData.email
        }&passwordResetToken=${passwordResetToken}`;
        await this.forgotPasswordEmailService.sendEmail(forgotData.email, {
          userName: addRestoreData.name,
          passwordResetToken: passwordResetToken,
          passwordResetExpires: passwordResetExpires.toString(),
          actionUrl: actionUrl,
        });
        return {
          message: AuthMessages.forgotPassword.emailSent,
        };
      } else {
        return {
          message: AuthMessages.forgotPassword.emailSent,
        };
      }
    } else {
      return {
        message: AuthMessages.forgotPassword.emailSent,
      };
    }
  }

  async resetPassword(restoreData: RestoreParams) {
    const userMain = await this.prismaService.userMain
      .findFirst({
        where: {
          email: restoreData.email,
          passwordResetToken: restoreData.passwordResetToken,
          passwordResetExpires: {
            gt: new Date(),
          },
        },
      })
      .catch((error) => {
        console.log(error);
      });
    if (!userMain) {
      throw new AuthUserNotFoundException();
    }
    const passwordHash = await argon2.hash(restoreData.password);
    await this.prismaService.userMain.update({
      where: {
        id: userMain.id,
      },
      data: {
        password: passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });
    await this.resetPasswordEmailService
      .sendEmail(userMain.email, {
        userName: userMain.name,
      })
      .catch((error) => {
        console.log(error);
      });
    return {
      message: AuthMessages.resetPassword.good,
    };
  }

  async refreshToken(refreshTokenDto: { refreshToken: string }) {
    const payload = await this.jwtService.verify(refreshTokenDto.refreshToken);
    if (!payload) {
      throw new AuthUserNotFoundException();
    }
    const newPayload = {
      data: {
        id: payload.data.id,
        email: payload.data.email,
        name: payload.data.name,
        role: payload.data.role,
        mainCompany: payload.data.mainCompany,
        currentCompany: payload.data.currentCompany,
      },
    };
    const token = await this.jwtService.sign(newPayload);
    const user = {
      id: payload.data.id,
      email: payload.data.email,
      name: payload.data.name,
      role: payload.data.role,
      mainCompany: payload.data.mainCompany,
      currentCompany: payload.data.currentCompany,
    };
    return { user, token };
  }
}
