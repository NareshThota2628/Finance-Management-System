const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.SENDGRID_USER,
    pass: process.env.SENDGRID_API_KEY
  }
});

const emailTemplates = {
  verification: (token) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Verify Your Email</h2>
      <p>Click the button below to complete your registration:</p>
      <a href="${process.env.CLIENT_URL}/verify-email/${token}" 
         style="display: inline-block; padding: 12px 24px; background-color: #2563eb; 
                color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">
        Verify Email
      </a>
      <p style="margin-top: 30px; color: #666;">
        If you didn't request this, please ignore this email.
      </p>
    </div>
  `,

  passwordReset: (token) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #dc2626;">Password Reset Request</h2>
      <p>Click the button below to reset your password:</p>
      <a href="${process.env.CLIENT_URL}/reset-password/${token}" 
         style="display: inline-block; padding: 12px 24px; background-color: #dc2626; 
                color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">
        Reset Password
      </a>
      <p style="margin-top: 30px; color: #666;">
        This link expires in 1 hour.
      </p>
    </div>
  `
};

module.exports = {
  sendVerificationEmail: async (email, token) => {
    const mailOptions = {
      from: 'no-reply@financeai.com',
      to: email,
      subject: 'Verify Your Email Address',
      html: emailTemplates.verification(token)
    };

    try {
      await transporter.sendMail(mailOptions);
      logger.info(`Verification email sent to ${email}`);
    } catch (error) {
      logger.error(`Email Error: ${error.message}`);
      throw new Error('Failed to send verification email');
    }
  },

  sendPasswordResetEmail: async (email, token) => {
    const mailOptions = {
      from: 'security@financeai.com',
      to: email,
      subject: 'Password Reset Request',
      html: emailTemplates.passwordReset(token)
    };

    try {
      await transporter.sendMail(mailOptions);
      logger.info(`Password reset email sent to ${email}`);
    } catch (error) {
      logger.error(`Email Error: ${error.message}`);
      throw new Error('Failed to send password reset email');
    }
  }
};