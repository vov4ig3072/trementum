import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class NotificationService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('MAIL_SENDER_EMAIL'),
        pass: this.configService.get('MAIL_SENDER_PASSWORD'),
      },
    });
  }

  sendEmail(template: any) {
    const { users, subject, message } = template;
    users.forEach((user) => {
      const mailOptions = {
        subject,
        to: user.email,
        html: message,
      };
      this.transporter.sendMail(mailOptions);
    });
    return { message: 'Mail send successfully' };
  }
}
