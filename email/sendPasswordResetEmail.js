import sgMail from '@sendgrid/mail';
import { SENDER_EMAIL, SENDGRID_API_KEY } from '../configs/sendGrid.js';

sgMail.setApiKey(SENDGRID_API_KEY);

// Function to send the password reset email
export const sendPasswordResetEmail = (recipientEmail, resetToken) => {
  // Define the email content
  const msg = {
    to: recipientEmail,
    from:  SENDER_EMAIL,
    subject: 'Password Reset',
    html: `
      <p>Hello,</p>
      <p>You have requested to reset your password. Please click the link below to reset your password:</p>
      <a href="https://pto-conceptandtool.netlify.app/reset-password/${resetToken}">Reset Password</a>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p>Thank you.</p>
    `,
  };

  // Send the email
  sgMail
    .send(msg)
    .then(() => {
      console.log('Password reset email sent');
    })
    .catch((error) => {
      console.error('Error sending password reset email:', error);
    });
};
