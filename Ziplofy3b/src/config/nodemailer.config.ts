import nodemailer from 'nodemailer';
// Env is loaded by env.utils (imported first in index.ts)

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to other services like 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify connection configuration
transporter.verify(function(error: Error | null, success?: boolean) {
  if (error) {
    console.log('Nodemailer configuration error:', error);
  } else {
    console.log('Nodemailer is ready to send emails');
  }
});

export default transporter;
