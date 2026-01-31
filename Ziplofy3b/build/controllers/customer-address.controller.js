"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomerAddressesByCustomerId = exports.deleteCustomerAddress = exports.updateCustomerAddress = exports.createCustomerAddress = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const customer_address_model_1 = require("../models/customer/customer-address.model");
const customer_model_1 = require("../models/customer/customer.model");
const error_utils_1 = require("../utils/error.utils");
// Create a new customer address
exports.createCustomerAddress = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { customerId, country, firstName, lastName, company, address, apartment, city, state, pinCode, phoneNumber, addressType } = req.body;
    if (!customerId) {
        throw new error_utils_1.CustomError("Customer ID is required", 400);
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(customerId)) {
        throw new error_utils_1.CustomError("Invalid customer ID format", 400);
    }
    if (!country || !firstName || !lastName || !address || !city || !state || !pinCode || !phoneNumber) {
        throw new error_utils_1.CustomError("Missing required address fields", 400);
    }
    // Check if this is the first address for this customer
    const existingAddresses = await customer_address_model_1.CustomerAddress.countDocuments({ customerId });
    const isFirstAddress = existingAddresses === 0;
    const newAddress = await customer_address_model_1.CustomerAddress.create({
        customerId,
        country,
        firstName,
        lastName,
        company,
        address,
        apartment,
        city,
        state,
        pinCode,
        phoneNumber,
        addressType,
    });
    // If this is the first address, set it as the default address
    if (isFirstAddress) {
        await customer_model_1.Customer.findByIdAndUpdate(customerId, {
            defaultAddress: newAddress._id
        });
    }
    res.status(201).json({
        success: true,
        message: "Customer address created successfully",
        data: newAddress,
    });
});
// Update a customer address
exports.updateCustomerAddress = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new error_utils_1.CustomError("Invalid address ID format", 400);
    }
    const updated = await customer_address_model_1.CustomerAddress.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    if (!updated) {
        throw new error_utils_1.CustomError("Customer address not found", 404);
    }
    res.status(200).json({
        success: true,
        message: "Customer address updated successfully",
        data: updated,
    });
});
// Delete a customer address
exports.deleteCustomerAddress = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new error_utils_1.CustomError("Invalid address ID format", 400);
    }
    const deleted = await customer_address_model_1.CustomerAddress.findByIdAndDelete(id);
    if (!deleted) {
        throw new error_utils_1.CustomError("Customer address not found", 404);
    }
    // Check if the deleted address was the default address
    const customer = await customer_model_1.Customer.findById(deleted.customerId);
    if (customer && customer.defaultAddress && customer.defaultAddress.toString() === id) {
        // Find another address for this customer to set as default
        const remainingAddresses = await customer_address_model_1.CustomerAddress.find({ customerId: deleted.customerId });
        if (remainingAddresses.length > 0) {
            // Set the first remaining address as the new default
            await customer_model_1.Customer.findByIdAndUpdate(deleted.customerId, {
                defaultAddress: remainingAddresses[0]._id
            });
        }
        else {
            // No remaining addresses, set defaultAddress to null
            await customer_model_1.Customer.findByIdAndUpdate(deleted.customerId, {
                defaultAddress: null
            });
        }
    }
    res.status(200).json({
        success: true,
        message: "Customer address deleted successfully",
        data: {
            deletedAddress: {
                id: deleted._id,
                customerId: deleted.customerId,
                address: deleted.address,
            },
        },
    });
});
// Get all addresses for a customer
exports.getCustomerAddressesByCustomerId = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { customerId } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(customerId)) {
        throw new error_utils_1.CustomError("Invalid customer ID format", 400);
    }
    const addresses = await customer_address_model_1.CustomerAddress.find({ customerId }).sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        message: "Customer addresses retrieved successfully",
        data: addresses,
        count: addresses.length,
    });
});
