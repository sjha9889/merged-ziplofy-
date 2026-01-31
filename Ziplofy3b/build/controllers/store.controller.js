"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStore = exports.getStoresByUserId = exports.createStore = void 0;
const general_settings_model_1 = require("../models/general-settings/general-settings.model");
const notification_settings_model_1 = require("../models/notification-settings/notification-settings.model");
const location_model_1 = require("../models/location/location.model");
const store_model_1 = require("../models/store/store.model");
const subdomain_model_1 = require("../models/subdomain.model");
const error_utils_1 = require("../utils/error.utils");
// Create a new store
exports.createStore = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { storeName, storeDescription } = req.body;
    const userId = req.user?.id;
    if (!userId) {
        throw new error_utils_1.CustomError("User not authenticated", 401);
    }
    // Check duplicate by store name for this user (case-insensitive)
    const existingStore = await store_model_1.Store.findOne({
        userId,
        storeName: { $regex: new RegExp(`^${storeName}$`, 'i') }
    });
    if (existingStore) {
        throw new error_utils_1.CustomError("A store with this name already exists for this user", 400);
    }
    const store = await store_model_1.Store.create({
        userId,
        storeName,
        storeDescription,
    });
    // Create default general settings for the store
    await general_settings_model_1.GeneralSettings.create({
        storeId: store._id,
        storeName: store.storeName,
        storeEmail: req.user?.email || '',
    });
    await notification_settings_model_1.NotificationSettings.create({
        storeId: store._id,
        senderEmail: req.user?.email || '',
    });
    // Create default subdomain mapping for this store with a short retry on collisions
    try {
        const base = (storeName || 'store')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || 'store';
        let attempts = 0;
        let created = false;
        while (!created && attempts < 5) {
            const suffix = Math.random().toString(36).slice(2, 6);
            const subdomain = `${base}-${suffix}`;
            try {
                await subdomain_model_1.Subdomain.create({ storeId: store._id, subdomain });
                created = true;
            }
            catch (err) {
                // Duplicate subdomain or unique constraint error: retry with new suffix
                if (err && err.code === 11000) {
                    attempts += 1;
                    continue;
                }
                // Other errors: log and break
                console.error('Failed to create store subdomain:', err);
                break;
            }
        }
    }
    catch (e) {
        console.error('Unexpected error while creating store subdomain:', e);
    }
    // Create a default location for this store and set reference
    const defaultLocation = await location_model_1.LocationModel.create({
        storeId: store._id,
        name: 'Default Location',
        countryRegion: 'United States',
        address: '123 Default Street',
        apartment: '',
        city: 'Default City',
        state: 'CA',
        postalCode: '00000',
        phone: '+1-000-000-0000',
        canShip: true,
        canLocalDeliver: false,
        canPickup: true,
        isDefault: true,
        isFulfillmentAllowed: true,
        isActive: true,
    });
    store.defaultLocation = defaultLocation._id;
    await store.save();
    res.status(201).json({
        success: true,
        data: store,
        message: "Store created successfully",
    });
});
// Get all stores for authenticated user
exports.getStoresByUserId = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const userId = req.user?.id;
    const stores = await store_model_1.Store.find({ userId });
    res.status(200).json({
        success: true,
        data: stores,
        count: stores.length,
    });
});
// Update a store
exports.updateStore = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const update = req.body;
    if (!id) {
        throw new error_utils_1.CustomError("Store id is required", 400);
    }
    const store = await store_model_1.Store.findOneAndUpdate({ _id: id, userId }, update, { new: true, runValidators: true });
    if (!store) {
        throw new error_utils_1.CustomError("Store not found", 404);
    }
    res.status(200).json({
        success: true,
        data: store,
        message: "Store updated successfully",
    });
});
