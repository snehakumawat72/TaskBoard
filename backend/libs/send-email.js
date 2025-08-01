import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import NotificationService from "./notification.service.js";

dotenv.config();
console.log("Using SendGrid Key:", process.env.SENDGRID_API_KEY); 
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const fromEmail = process.env.FROM_EMAIL;

export const sendEmail = async (to, subject, html, userId = null, emailType = 'System Email') => {
  const msg = {
    to,
    from: `TaskBoard <${fromEmail}>`,
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent successfully");

    // Create email notification if userId is provided
    if (userId) {
      try {
        await NotificationService.createEmailNotification(
          userId,
          emailType,
          subject,
          `Email sent to ${to}`
        );
      } catch (notificationError) {
        console.log('Failed to create email notification:', notificationError);
      }
    }

    return true;
  } catch (error) {
    console.error("Error sending email:", error);

    return false;
  }
};