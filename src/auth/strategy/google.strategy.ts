import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { GoogleConfig } from 'src/common/interfaces/config.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT,
      scope: configService.get<GoogleConfig>('google').scopes,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {

    const { given_name, family_name, email, picture } = profile._json;
    const user: any = {
      email: email,
      firstName: given_name,
      lastName: family_name,
      picture,
      accessToken,
      refreshToken,
      provider: profile.provider
    };

    done(null, user);
  }
}
