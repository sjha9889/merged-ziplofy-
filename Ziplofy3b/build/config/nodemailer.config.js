"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
// Env is loaded by env.utils (imported first in index.ts)
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail', // You can change this to other services like 'outlook', 'yahoo', etc.
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
    },
});
// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.log('Nodemailer configuration error:', error);
    }
    else {
        console.log('Nodemailer is ready to send emails');
    }
});
exports.default = transporter;
