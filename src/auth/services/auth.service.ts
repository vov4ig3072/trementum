import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IUser } from 'src/common/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  loginUser({
    email,
    accessToken,
    refreshToken,
    firstName,
    lastName,
    picture,
    provider,
  }: IUser) {
    return this.prisma.sources.upsert({
      where: { email },
      update: {
        auth: {
          update: { where: { email }, data: { accessToken, refreshToken } },
        },
      },
      create: {
        email,
        firstName,
        lastName,
        auth: {
          create: {
            email,
            accessToken,
            provider,
            picture,
            refreshToken,
          },
        },
      },
    });
  }
}
