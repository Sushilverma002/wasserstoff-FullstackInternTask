import nodemailer from "nodemailer";
import { config } from "dotenv";
config();
//transporter
const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS,
  },
});

export default transporter;
