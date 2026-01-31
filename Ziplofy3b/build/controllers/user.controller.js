"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = exports.createUser = void 0;
const user_model_1 = require("../models/user.model");
const error_utils_1 = require("../utils/error.utils");
exports.createUser = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { name, email, password, role, status } = req.body;
    const user = await user_model_1.User.create({
        name,
        email,
        password,
        role,
        status: "active"
    });
    // Remove password from response
    const userResponse = await user_model_1.User.findById(user._id).select("-password");
    res.status(201).json({
        success: true,
        data: userResponse,
    });
});
exports.getUsers = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { search, role, status, page = "1", limit = "10", sort = "createdAt", } = req.query;
    // Build filter object
    const filter = {};
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    }
    if (role && role !== "all") {
        filter.role = role;
    }
    if (status && status !== "all") {
        filter.status = status;
    }
    // Execute query with pagination
    const users = await user_model_1.User.find(filter)
        .select("-password")
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .sort(sort === "newest" ? { createdAt: -1 } : { createdAt: 1 });
    // Get total documents count
    const count = await user_model_1.User.countDocuments(filter);
    res.status(200).json({
        success: true,
        data: users,
        totalPages: Math.ceil(count / parseInt(limit)),
        currentPage: parseInt(page),
        total: count,
    });
});
exports.getUser = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { id } = req.params;
    const user = await user_model_1.User.findById(id).select("-password");
    if (!user) {
        throw new error_utils_1.CustomError("User not found", 404);
    }
    res.status(200).json({
        success: true,
        data: user,
    });
});
exports.updateUser = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { id } = req.params;
    const { name, email, role, status } = req.body;
    const user = await user_model_1.User.findByIdAndUpdate(id, { name, email, role, status, updatedAt: new Date() }, {
        new: true,
        runValidators: true,
    }).select("-password");
    if (!user) {
        throw new error_utils_1.CustomError("User not found", 404);
    }
    res.status(200).json({
        success: true,
        data: user,
    });
});
exports.deleteUser = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { id } = req.params;
    // Prevent super-admin from deleting themselves
    if (id === req.user?.id) {
        throw new error_utils_1.CustomError("You cannot delete your own account", 400);
    }
    const user = await user_model_1.User.findByIdAndDelete(id);
    if (!user) {
        throw new error_utils_1.CustomError("User not found", 404);
    }
    res.status(200).json({
        success: true,
        data: {},
    });
});
