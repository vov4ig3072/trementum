import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import config from './common/configs/config';
import { YoutoobeModule } from './youtoobe/youtoobe.module';
import { GoogleModule } from './google/google.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    AuthModule,
    PrismaModule,
    YoutoobeModule,
    GoogleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
