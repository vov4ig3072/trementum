import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notification: NotificationService) {}

  @Post()
  sendEmail(@Body() body: any){
    return this.notification.sendEmail(body)
  }
}
