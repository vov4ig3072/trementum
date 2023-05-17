import { Module } from '@nestjs/common';
import { YoutoobeService } from './youtoobe.service';
import { YoutoobeController } from './youtoobe.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [YoutoobeService, PrismaService],
  controllers: [YoutoobeController],
})
export class YoutoobeModule {}
