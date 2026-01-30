import { ConnectionOptions, Queue } from 'bullmq';
import { redisConfig } from '../../../config/redis.config';

export const EMAIL_QUEUE = 'email_queue';

export const emailQueue = new Queue(EMAIL_QUEUE, {
  connection: redisConfig.connection as ConnectionOptions,
});

export async function enqueueEmailAddress(to: string, subject?: string, html?: string, text?: string) {
  return emailQueue.add('send_email', { to, subject, html, text });
}

export async function closeEmailQueue(): Promise<void> {
  await emailQueue.close();
}


