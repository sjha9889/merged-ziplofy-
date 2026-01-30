import { Request, Response } from "express";
import mongoose from "mongoose";
import { CustomerAddress, ICustomerAddress } from "../models/customer/customer-address.model";
import { Customer } from "../models/customer/customer.model";
import { asyncErrorHandler, CustomError } from "../utils/error.utils";

// Create a new customer address
export const createCustomerAddress = asyncErrorHandler(async (req: Request, res: Response) => {
  const { customerId, country, firstName, lastName, company, address, apartment, city, state, pinCode, phoneNumber, addressType}
    = req.body as  Omit<ICustomerAddress, "_id">;

  if (!customerId) {
    throw new CustomError("Customer ID is required", 400);
  }
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    throw new CustomError("Invalid customer ID format", 400);
  }
  if (!country || !firstName || !lastName || !address || !city || !state || !pinCode || !phoneNumber) {
    throw new CustomError("Missing required address fields", 400);
  }

  // Check if this is the first address for this customer
  const existingAddresses = await CustomerAddress.countDocuments({ customerId });
  const isFirstAddress = existingAddresses === 0;

  const newAddress = await CustomerAddress.create({
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
    await Customer.findByIdAndUpdate(customerId, {
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
export const updateCustomerAddress = asyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body as Partial<ICustomerAddress>;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new CustomError("Invalid address ID format", 400);
  }

  const updated = await CustomerAddress.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!updated) {
    throw new CustomError("Customer address not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Customer address updated successfully",
    data: updated,
  });
});

// Delete a customer address
export const deleteCustomerAddress = asyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new CustomError("Invalid address ID format", 400);
  }

  const deleted = await CustomerAddress.findByIdAndDelete(id);
  if (!deleted) {
    throw new CustomError("Customer address not found", 404);
  }

  // Check if the deleted address was the default address
  const customer = await Customer.findById(deleted.customerId);
  if (customer && customer.defaultAddress && customer.defaultAddress.toString() === id) {
    // Find another address for this customer to set as default
    const remainingAddresses = await CustomerAddress.find({ customerId: deleted.customerId });
    
    if (remainingAddresses.length > 0) {
      // Set the first remaining address as the new default
      await Customer.findByIdAndUpdate(deleted.customerId, {
        defaultAddress: remainingAddresses[0]._id
      });
    } else {
      // No remaining addresses, set defaultAddress to null
      await Customer.findByIdAndUpdate(deleted.customerId, {
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
export const getCustomerAddressesByCustomerId = asyncErrorHandler(async (req: Request, res: Response) => {
  const { customerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    throw new CustomError("Invalid customer ID format", 400);
  }

  const addresses = await CustomerAddress.find({ customerId }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Customer addresses retrieved successfully",
    data: addresses,
    count: addresses.length,
  });
});


