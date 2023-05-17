import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { IUser } from 'src/common/interfaces/user.interface';
import { YoutoobeService } from './youtoobe.service';
import { FilterDto } from './dto/filter.dto';

@Controller('youtoobe')
export class YoutoobeController {
  constructor(private readonly youtoobe: YoutoobeService) {}

  @UseGuards(JwtAuthGuard)
  @Get('channels')
  getChannnel(@User() user: IUser) {
    return this.youtoobe.getChannels(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('posts')
  getPosts(@User() user: IUser) {
    return this.youtoobe.getPosts(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('posts/filter')
  getFilteredPosts(@User() user: IUser, @Query() { end, start }: FilterDto) {
    return this.youtoobe.getFilteredPosts(user.id, start, end);
  }
}
