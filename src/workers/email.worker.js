const { Worker } = require("bullmq");
const bullRedis = require("../config/bullmq.redis");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

new Worker(
  "email-queue",
  async (job) => {
    const { to, subject, text } = job.data;

    await transporter.sendMail({
      from: `"Eventra" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log(`Email sent to ${to}`);
  },
  {
    connection: bullRedis,
  }
);
