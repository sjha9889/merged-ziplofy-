import mongoose from 'mongoose';
import { LocationModel } from '../models/location.model';
import { IStore, Store } from '../models/store';
import { IUser } from '../models/user';

/**
 * Creates a default store for a new user
 * @param user - The user object for whom to create the store
 * @returns Promise<IStore> - The created store
 */
export const createDefaultStore = async (user: IUser): Promise<IStore> => {
  const defaultStore = await Store.create({
    userId: user._id,
    storeName: `${user.name}'s Store`,
    storeDescription: `Welcome to ${user.name}'s store! This is your default store where you can start selling your products.`
  });

  // Create a default location for this store
  const defaultLocation = await LocationModel.create({
    storeId: defaultStore._id,
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

  // Save default location reference on store
  defaultStore.defaultLocation = defaultLocation._id as mongoose.Types.ObjectId;
  await defaultStore.save();

  console.log(`Default store created for user ${user.email}: ${defaultStore.storeName}`);
  return defaultStore;
};
