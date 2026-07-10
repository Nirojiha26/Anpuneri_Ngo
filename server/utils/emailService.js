const nodemailer = require('nodemailer');
const logger = require('./logger');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"NGO Organization" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    };
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`Email send error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

const sendContactConfirmation = async (name, email) => {
  return sendEmail({
    to: email,
    subject: 'We received your message - NGO Organization',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1565C0; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">NGO Organization</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2>Dear ${name},</h2>
          <p>Thank you for reaching out to us. We have received your message and our team will get back to you within 24-48 hours.</p>
          <p>Together, we can make a difference!</p>
          <br/>
          <p>Warm regards,</p>
          <p><strong>NGO Organization Team</strong></p>
        </div>
        <div style="background: #e0e0e0; padding: 10px; text-align: center; font-size: 12px;">
          <p>© ${new Date().getFullYear()} NGO Organization. All rights reserved.</p>
        </div>
      </div>
    `,
  });
};

const sendVolunteerConfirmation = async (name, email) => {
  return sendEmail({
    to: email,
    subject: 'Volunteer Application Received - NGO Organization',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2E7D32; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Thank You for Volunteering!</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2>Dear ${name},</h2>
          <p>We are thrilled to receive your volunteer application! Your willingness to give your time and skills to help our community means the world to us.</p>
          <p>Our volunteer coordinator will review your application and contact you shortly with next steps.</p>
          <br/>
          <p>With gratitude,</p>
          <p><strong>NGO Organization Volunteer Team</strong></p>
        </div>
      </div>
    `,
  });
};

module.exports = { sendEmail, sendContactConfirmation, sendVolunteerConfirmation };
