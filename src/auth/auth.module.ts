import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GoogleStrategy } from './strategy/google.strategy';
import { TokenService } from './services/token.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SecurityConfig } from 'src/common/interfaces/config.interface';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const securityConfig = config.get<SecurityConfig>('security');
        return {
          secret: config.get<string>('JWT_ACCESS_SECRET'),
          signOptions: {
            algorithm: securityConfig.algorithm,
            expiresIn: securityConfig.expiresIn,
          },
        };
      },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    TokenService,
    JwtService,
    JwtAuthGuard,
    JwtStrategy,
  ],
  exports: [JwtStrategy],
})
export class AuthModule {}
