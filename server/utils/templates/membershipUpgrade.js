import nodemailer from "nodemailer";
import "dotenv/config";
import { formatDate } from "../formateDate.js";

export const upgradeMembershipMailSender = async (user, pdf, data) => {
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
      from: `Our Gym`,
      to: `${user.email}`,
      subject: `Your Membership Upgrade Confirmation`,
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <div style="background-color: #007bff; color: #fff; text-align: center; padding: 15px; border-radius: 8px 8px 0 0;">
                        <h2 style="margin: 0;">Membership Upgrade Confirmation</h2>
                    </div>
                    
                    <div style="padding: 20px;">
                        <p style="font-size: 16px; color: #333;">Hello <strong>${
                          user.name
                        }</strong>,</p>
                        <p style="font-size: 14px; color: #555;">
                            Congratulations! You have successfully upgraded your membership from 
                            <strong>${
                              data.currentMembership
                            }</strong> to <strong>${
        data.newMembershipType
      }</strong>.
                            Enjoy enhanced benefits and a better gym experience!
                        </p>
                        
                        <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 5px;">
                            <h3 style="margin: 0; color: #007bff;">Upgrade Details</h3>
                            <p style="margin: 5px 0;"><strong>Previous Membership:</strong> ${
                              data.currentMembership
                            }</p>
                            <p style="margin: 5px 0;"><strong>New Membership:</strong> ${
                              data.newMembershipType
                            }</p>
                            <p style="margin: 5px 0;"><strong>Price Paid:</strong> ₹${
                              data.price
                            }</p>
                            <p style="margin: 5px 0;"><strong>Start Date:</strong> ${formatDate(
                              user.membershipStartDate
                            )}</p>
                            <p style="margin: 5px 0;"><strong>Expiry Date:</strong> ${formatDate(
                              user.membershipExpirationDate
                            )}</p>
                        </div>

                        <p style="margin-top: 20px; font-size: 14px; color: #555;">
                            Your updated invoice is attached to this email. If you have any questions regarding your upgrade, 
                            feel free to contact our support team.
                        </p>
                        
                        <p style="font-size: 14px; color: #333;">Best regards,<br><strong>The Gym Team</strong></p>
                    </div>

                    <div style="background-color: #007bff; color: #fff; text-align: center; padding: 10px; border-radius: 0 0 8px 8px;">
                        <p style="margin: 0; font-size: 12px;">&copy; 2025 Our Gym. All rights reserved.</p>
                    </div>
                </div>
            `,
      attachments: [
        {
          filename: "upgrade-invoice.pdf",
          content: pdf,
        },
      ],
    });
  } catch (err) {
    console.log("Error while sending upgrade membership email: ", err.message);
  }
};
