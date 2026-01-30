import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { GeneralSettings } from '../models/general-settings.model';
import { NotificationSettings } from '../models/notification-settings.model';
import { StoreSubdomain } from '../models/store-subdomain';
import { IUser, User } from '../models/user';
import { asyncErrorHandler, CustomError } from '../utils/error.utils';
import { createDefaultMarket } from '../utils/market.utils';
import { createDefaultStore } from '../utils/store.utils';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export interface JwtPayload {
    uid: string;
    role: string;
    email: string;
}

export interface SecureUserInfo {
    id: string;
    email: string;
    role: string;
    name: string;
    accessToken: string;
    assignedSupportDeveloperId: string | null;
}

export const signAccessToken = (user: IUser): string => {  
    const payload: JwtPayload = {
      uid: user._id.toString(),
      role: "client",
      email: user.email
    };
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });  
};

export const register = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body as Pick<IUser, 'name' | 'email'> & { password: string };
    const existingUser = await User.findOne({ email });

    if (existingUser) return next(new CustomError('User already exists', 400));

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      hashedPassword,
      role: "68c2bf34749d79f42291f35a",
      status: 'Active',
      totalPurchases: 0
    });

    // Create a default store for the new user
    const store = await createDefaultStore(user);

    // Create default general settings for the store
    await GeneralSettings.create({ 
      storeId: store._id,
      storeName: store.storeName,
      storeEmail: user.email
    });

    // Create default notification settings for the store
    await NotificationSettings.create({
      storeId: store._id,
      senderEmail: user.email,
    });

    // Create default market (India) for the store
    await createDefaultMarket(store._id);

    // Create a default subdomain mapping for the store
    const slugBase = (user.name || user.email.split('@')[0] || 'store')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const suffix = Math.random().toString(36).slice(2, 6);
    const subdomain = `${slugBase}-${suffix}`;
    await StoreSubdomain.create({ storeId: store._id, subdomain });

    const token = signAccessToken(user);

    const response: SecureUserInfo = {
      id: user._id.toString(),
      email: user.email,
      role: "client",
      name: user.name,
      accessToken: token,
      assignedSupportDeveloperId: user.assignedSupportDeveloperId?.toString() || "",
    };

    return res.status(201).json(response);
});

export const login = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {

  const { email, password } = req.body as Pick<IUser, 'email'> & { password: string };
  const user = await User.findOne({ email });

  if (!user) {
    return next(new CustomError('Invalid credentials', 400));
  }

  if (!(await bcrypt.compare(password, user.hashedPassword!))) {
    return next(new CustomError('Invalid credentials', 400));
  }

  const access = signAccessToken(user);

  const response: SecureUserInfo = {
    id: user._id.toString(),
    email: user.email,
    role: "client",
    name: user.name,
    accessToken: access,
    assignedSupportDeveloperId: user.assignedSupportDeveloperId?.toString() || "",
  };
  return res.status(200).json(response);
});

export const googleAuth = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { credential } = req.body as { credential: string };

    if (!credential) return next(new CustomError('No credential provided', 400));
    
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload) return next(new CustomError('Invalid Google token', 401));
    

    let user: IUser | null = await User.findOne({ email: payload.email });

    if (!user) {
      user = await User.create({
        email: payload.email,
        name: payload.name,
        provider: 'google',
        googleId: payload.sub,
        status: "Pending",
        role: "68c2bf34749d79f42291f35a",
      });

      // Create a default store for the new Google user
      const store = await createDefaultStore(user);

      // Create default general settings for the store
      await GeneralSettings.create({ 
        storeId: store._id,
        storeName: store.storeName,
        storeEmail: user.email
      });

      // Create default notification settings for the store
      await NotificationSettings.create({
        storeId: store._id,
        senderEmail: user.email,
      });

      // Create default market (India) for the store
      await createDefaultMarket(store._id);

      // Create a default subdomain mapping for the store
      const slugBase = (user.name || user.email.split('@')[0] || 'store')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      const suffix = Math.random().toString(36).slice(2, 6);
      const subdomain = `${slugBase}-${suffix}`;
      await StoreSubdomain.create({ storeId: store._id, subdomain });
    }

    const access = signAccessToken(user);

    const response: SecureUserInfo = {
      id: user._id.toString(),
      email: user.email,
      role: "client",
      name: user.name,
      accessToken: access,
      assignedSupportDeveloperId: user.assignedSupportDeveloperId?.toString() || "",
    };

    return res.status(200).json(response);
});

export const me = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json(req.user);
});
