"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailQueue = exports.EMAIL_QUEUE = void 0;
exports.enqueueEmailAddress = enqueueEmailAddress;
exports.closeEmailQueue = closeEmailQueue;
const bullmq_1 = require("bullmq");
const redis_config_1 = require("../../../config/redis.config");
exports.EMAIL_QUEUE = 'email_queue';
exports.emailQueue = new bullmq_1.Queue(exports.EMAIL_QUEUE, {
    connection: redis_config_1.redisConfig.connection,
});
async function enqueueEmailAddress(to, subject, html, text) {
    return exports.emailQueue.add('send_email', { to, subject, html, text });
}
async function closeEmailQueue() {
    await exports.emailQueue.close();
}
