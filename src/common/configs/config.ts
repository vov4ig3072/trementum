import { IConfig } from '../interfaces/config.interface';

const config: IConfig = {
  nest: { port: 3007 },
  google: {
    scopes: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/youtube.readonly',
    ],
    redirect_uri: 'http://localhost:3007/auth/url',
  },
  security: { bcryptSaltOrRound: 10, expiresIn: '4d', algorithm: 'HS256' },
};

export default (): IConfig => config;
