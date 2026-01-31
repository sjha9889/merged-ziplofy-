"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startEmailWorker = startEmailWorker;
const bullmq_1 = require("bullmq");
const email_queue_1 = require("../queues/email.queue");
const redis_config_1 = require("../../../config/redis.config");
const nodemailer_config_1 = __importDefault(require("../../../config/nodemailer.config"));
function startEmailWorker() {
    return new bullmq_1.Worker(email_queue_1.EMAIL_QUEUE, async (job) => {
        const { to, subject, html, text } = job.data;
        await nodemailer_config_1.default.sendMail({
            to,
            from: process.env.SMTP_FROM || 'no-reply@example.com',
            subject: subject || 'Notification from Ziplofy',
            html: html || `<p>${text || 'Hello from Ziplofy.'}</p>`,
            text: text || 'Hello from Ziplofy.',
        });
        return { delivered: true };
    }, {
        connection: redis_config_1.redisConfig.connection,
    });
}
