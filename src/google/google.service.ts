import { Injectable } from '@nestjs/common';
import googleClient from './google-client';
import { PrismaService } from 'src/prisma/prisma.service';
import { google, sheets_v4, youtube_v3 } from 'googleapis';

@Injectable()
export class GoogleService {
  protected readonly client = googleClient.client;

  constructor(protected readonly prisma: PrismaService) {}

  private async setCredentials(userId: number): Promise<void> {
    const { accessToken, refreshToken } =
      await this.prisma.authProvider.findFirst({
        where: { sourcesId: userId },
      });

    this.client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  protected async getYoutoobe(userId: number): Promise<youtube_v3.Youtube> {
    await this.setCredentials(userId);
    return google.youtube({ version: 'v3', auth: this.client });
  }

  protected async getSheets(userId: number): Promise<sheets_v4.Sheets> {
    await this.setCredentials(userId);
    return google.sheets({ version: 'v4', auth: this.client });
  }
}
