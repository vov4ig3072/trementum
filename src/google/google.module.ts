import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  providers: [GoogleService]
})
export class GoogleModule {}
