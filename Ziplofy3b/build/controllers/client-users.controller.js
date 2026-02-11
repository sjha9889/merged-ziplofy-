"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientUsers = void 0;
const axios_1 = __importDefault(require("axios"));
const error_utils_1 = require("../utils/error.utils");
const CLIENT_SERVER_URL = process.env.CLIENT_SERVER_URL || "http://localhost:4000";
/**
 * Fetches client-registered users from the Ziplofy client-side server (port 3000/4000).
 * Used by the admin Client List page.
 */
exports.getClientUsers = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    try {
        const url = `${CLIENT_SERVER_URL}/api/auth/users`;
        const response = await axios_1.default.get(url, { timeout: 10000 });
        const data = response.data?.data || response.data || [];
        const users = Array.isArray(data) ? data : [];
        res.status(200).json({
            success: true,
            data: users,
            total: users.length,
            currentPage: 1,
            totalPages: 1,
        });
    }
    catch (err) {
        if (err.code === "ECONNREFUSED") {
            throw new error_utils_1.CustomError(`Cannot connect to client server at ${CLIENT_SERVER_URL}. Ensure the Ziplofy client server (port 3000/4000) is running.`, 503);
        }
        throw new error_utils_1.CustomError(err.response?.data?.message || err.message || "Failed to fetch client users", err.response?.status || 500);
    }
});
