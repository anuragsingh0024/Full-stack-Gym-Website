import nodemailer from "nodemailer";
import "dotenv/config";

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      secure: false,
      port: 587,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: `Study Notion || Anurag singh`,
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });

    console.log("info", info);
    return info;
  } catch (err) {
    console.log("Error while sending email", err.message);
  }
};

export { mailSender };
