import { Algorithm } from 'jsonwebtoken';

export interface IConfig {
  nest: NestConfig;
  google: GoogleConfig;
  security: SecurityConfig;
}

export interface NestConfig {
  port: number;
}

export interface GoogleConfig {
  scopes: Array<string>;
  redirect_uri: string;
}

export interface SecurityConfig {
  bcryptSaltOrRound: number;
  expiresIn: string;
  algorithm: Algorithm;
}
