import crypto from 'crypto';

// Function to generate a unique reset token
export const generateResetToken = () => {
  const token = crypto.randomBytes(20).toString('hex');
  return token;
};

// Function to generate the expiration date for the reset token
export const generateResetTokenExpiration = () => {
  // Set the token expiration to 1 hour from the current time
  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + 1);
  return expirationDate;
};
