import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import googleClient from '../google/google-client';
import { ConfigService } from '@nestjs/config';
import { GoogleConfig } from 'src/common/interfaces/config.interface';
import { AuthGuard } from '@nestjs/passport';
import { IUser } from 'src/common/interfaces/user.interface';
import { User } from 'src/common/decorators/user.decorator';
import { TokenService } from './services/token.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  private readonly client = googleClient.client;
  private googleConfig: GoogleConfig;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {
    this.googleConfig = configService.get<GoogleConfig>('google');
  }

  @Get('url')
  async getAuthUrl(@Query('accessToken') accessToken: string) {
    if (accessToken) {
      return { accessToken };
    }
    const url = this.client.generateAuthUrl({
      access_type: 'offline',
      scope: this.googleConfig.scopes.join(' '),
      prompt: 'consent',
    });
    return { url };
  }

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@User() user: IUser, @Res() res: Response) {
    const { id, email } = await this.authService.loginUser(user);
    const accessToken = await this.tokenService.generateAccessToken(id, email);

    return res.redirect(
      `${this.googleConfig.redirect_uri}?accessToken=${accessToken}`,
    );
  }
}
