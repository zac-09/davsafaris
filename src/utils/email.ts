import nodemailer from "nodemailer";
import pug from "pug";
import { convert } from "html-to-text";
import { AppError } from "./error";
export class Email {
  transporter;
  from: string;
  recipients: string;
  text: string;
  subject: string;
  constructor(recipients: any, subject: string, text_message: string) {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
      secure: false,
    });

    this.from = "support@fida.com";
    this.recipients = recipients;
    this.subject = subject;
    this.text = text_message;
  }
  async send() {
    //render html based on pug template

    const mailOptions = {
      from: this.from,
      to: this.recipients,
      subject: this.subject,
      text: this.text,
    };
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (err) {
      console.log("error sending email", err);
    }
  }
  async sendWelcome(first_name: string) {
    const html = pug.renderFile(`${__dirname}/../views/email/welcome.pug`, {
      firstName: first_name,
      subject: this.subject,
    });
    await this.sendHtml(html, "Welcome to Fida Uganda Ims");
  }
  async sendBasicMail(
    first_name: string,
    message: string,
    subscriberEmail: string,
    contact: string
  ) {
    const html = pug.renderFile(`${__dirname}/../views/email/info.pug`, {
      first_name,
      message,
      subscriberEmail,
      contact,
    });
    await this.sendHtml(html, this.subject);
  }
  async sendHtml(html: any, subject: string) {
    //render html based on pug template

    const mailOptions = {
      from: this.from,
      to: this.recipients,
      subject,
      text: convert(html),
      html,
    };
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (err) {
      console.log("error sending email", err);
      new AppError("failed to send email", 403);
    }
  }
  async sendPasswordReset(url: string, firstName: string) {
    console.log("from wmal server", url);
    const html = pug.renderFile(
      `${__dirname}/../views/email/passwordReset.pug`,
      {
        firstName: firstName,
        subject: this.subject,
        url,
      }
    );
    await this.sendHtml(html, "Reset Password");
  }
}
