import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { from } from 'form-data';
import { Twilio } from 'twilio';

@Injectable()
export class EmailSmsService {
  private twilioClient: Twilio;

  constructor() {
    // Initialize SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Initialize Twilio
    this.twilioClient = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  // Send email using SendGrid
  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject,
      text,
    };
    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  // Send SMS using Twilio
  async sendSms(to: string, body: string): Promise<void> {
    console.log(to, process.env.TWILIO_PHONE_NUMBER);
    try {
      await this.twilioClient.messages.create({
        body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to,
      });
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  }
}
