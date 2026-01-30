import { Worker, ConnectionOptions } from 'bullmq';
import { EMAIL_QUEUE } from '../queues/email.queue';
import { redisConfig } from '../../../config/redis.config';
import transporter from '../../../config/nodemailer.config';

export function startEmailWorker(): Worker {
  return new Worker(
    EMAIL_QUEUE,
    async (job) => {
      const { to, subject, html, text } = job.data as { to: string; subject?: string; html?: string; text?: string };
      await transporter.sendMail({
        to,
        from: process.env.SMTP_FROM || 'no-reply@example.com',
        subject: subject || 'Notification from Ziplofy',
        html: html || `<p>${text || 'Hello from Ziplofy.'}</p>`,
        text: text || 'Hello from Ziplofy.',
      });
      return { delivered: true };
    },
    {
      connection: redisConfig.connection as ConnectionOptions,
    }
  );
}


