import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { asyncErrorHandler, CustomError } from "../utils/error.utils";
import { User } from "../models/user.model";
import { Role } from "../models/role.model";
import { LoginOtp } from "../models/login-otp.model";
import { sendEmail } from "../utils/email.utils";


export const getMe = asyncErrorHandler(async (req: Request, res: Response) => {
  console.log("🔍 /auth/me - User accessing roles and permission section:");
  console.log("User ID:", req.user?.id);
  console.log("User Email:", req.user?.email);
  console.log("User Role:", req.user?.role);
  console.log("User Name:", req.user?.name);
  console.log("Is Super Admin:", (req.user as any)?.superAdmin);
  console.log("Assigned Support Developer ID:", req.user?.assignedSupportDeveloperId);
  console.log("Full User Object:", JSON.stringify(req.user, null, 2));
  
  // If user role is still an ObjectId, we need to populate it
  if (req.user?.role && req.user.role.length === 24) {
    console.log("🔄 Role is ObjectId, populating role information...");
    const user = await User.findById(req.user.id).populate('role');
    if (user && user.role) {
      const role = user.role as any;
      req.user.role = role.name;
      (req.user as any).superAdmin = role.isSuperAdmin || role.name === 'super-admin';
      console.log("✅ Updated role information:", {
        roleName: role.name,
        isSuperAdmin: role.isSuperAdmin || role.name === 'super-admin'
      });
    }
  }
  
  res.status(200).json({
    success: true,
    data: req.user
  });
});

export const adminLogin = asyncErrorHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) throw new CustomError("Please provide email and password", 400);

  const user = await User.findOne({ email }).select("+password role status name email lastLogin");
  if (!user) throw new CustomError("Invalid credentials", 401);
  if (user.status !== "active") throw new CustomError("Account is not active", 403);

  const role = await Role.findById(user.role);
  if (!role) throw new CustomError("Role not found", 401);

  const adminRoleNames = ["super-admin","support-admin","developer-admin","admin"];
  if (!adminRoleNames.includes(role.name)) throw new CustomError("Not authorized as admin", 403);

  const isMatch = await bcrypt.compare(password, (user as any).password);
  if (!isMatch) throw new CustomError("Invalid credentials", 401);

  const token = jwt.sign(
    { uid: user._id.toString(), email: user.email }, 
    process.env.ACCESS_TOKEN_SECRET as string, 
    { expiresIn: "30d" }
  );

  user.lastLogin = new Date();
  await user.save();

  res.status(200).json({
    accessToken: token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      roleId: (role._id as any).toString(),
      roleName: role.name,
      roleLevel: 1, // Default level since we removed level from role model
      status: user.status,
      lastLogin: user.lastLogin,
      isSuperAdmin: role.isSuperAdmin || role.name === 'super-admin',
    }
  });
});

// Step 1: verify password and send OTP
export const adminLoginStep1 = asyncErrorHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) throw new CustomError("Please provide email and password", 400);

  const user = await User.findOne({ email }).select("+password role status name email lastLogin");
  if (!user) throw new CustomError("Invalid credentials", 401);
  if (user.status !== "active") throw new CustomError("Account is not active", 403);

  const role = await Role.findById(user.role);
  if (!role) throw new CustomError("Role not found", 401);
  const adminRoleNames = ["super-admin","support-admin","developer-admin","admin"];
  if (!adminRoleNames.includes(role.name)) throw new CustomError("Not authorized as admin", 403);

  const isMatch = await bcrypt.compare(password, (user as any).password);
  if (!isMatch) throw new CustomError("Invalid credentials", 401);

  // generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // upsert OTP for this email
  await LoginOtp.deleteMany({ email });
  await LoginOtp.create({ userId: user._id, email, code, expiresAt, attempts: 0 });

  // send email
  await sendEmail({
    to: email,
    subject: "Your Ziplofy Admin Login Code",
    body: `<p>Your verification code is:</p><h2 style="letter-spacing:4px">${code}</h2><p>This code expires in 5 minutes.</p>`
  });

  res.status(200).json({
    success: true,
    twoFactorRequired: true,
    // return lightweight context so frontend can proceed to otp step
    context: { email, userId: user._id.toString() }
  });
});

// Step 2: verify OTP and issue token
export const verifyAdminLoginOtp = asyncErrorHandler(async (req: Request, res: Response) => {
  const { email, code } = req.body as { email: string; code: string };
  if (!email || !code) throw new CustomError("Missing fields", 400);

  const otp = await LoginOtp.findOne({ email });
  if (!otp) throw new CustomError("Code expired or not found", 400);
  if (otp.expiresAt < new Date()) {
    await LoginOtp.deleteMany({ email });
    throw new CustomError("Code expired", 400);
  }
  if (otp.code !== code) {
    otp.attempts += 1;
    await otp.save();
    throw new CustomError("Invalid code", 401);
  }

  const user = await User.findOne({ email }).select("role status name email lastLogin");
  if (!user) throw new CustomError("User not found", 404);
  const role = await Role.findById(user.role);
  if (!role) throw new CustomError("Role not found", 404);

  const token = jwt.sign(
    { uid: user._id.toString(), email: user.email },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "30d" }
  );

  user.lastLogin = new Date();
  await user.save();
  await LoginOtp.deleteMany({ email });

  res.status(200).json({
    accessToken: token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      roleId: (role._id as any).toString(),
      roleName: role.name,
      roleLevel: 1,
      status: user.status,
      lastLogin: user.lastLogin,
      isSuperAdmin: role.isSuperAdmin || role.name === 'super-admin',
    }
  });
});

// Resend OTP with 60s cooldown
export const resendAdminLoginOtp = asyncErrorHandler(async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };
  if (!email) throw new CustomError("Email is required", 400);

  const existing = await LoginOtp.findOne({ email }).sort({ createdAt: -1 });
  const now = new Date();
  if (existing && existing.createdAt && now.getTime() - existing.createdAt.getTime() < 60 * 1000) {
    const remaining = 60 - Math.floor((now.getTime() - existing.createdAt.getTime()) / 1000);
    throw new CustomError(`Please wait ${remaining}s before resending code`, 429);
  }

  // Ensure user exists and active
  const user = await User.findOne({ email }).select("role status name email");
  if (!user) throw new CustomError("User not found", 404);
  if (user.status !== "active") throw new CustomError("Account is not active", 403);

  // generate new code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await LoginOtp.deleteMany({ email });
  await LoginOtp.create({ userId: user._id, email, code, expiresAt, attempts: 0 });

  await sendEmail({
    to: email,
    subject: "Your Ziplofy Admin Login Code",
    body: `<p>Your verification code is:</p><h2 style=\"letter-spacing:4px\">${code}</h2><p>This code expires in 5 minutes.</p>`
  });

  res.status(200).json({ success: true, message: "Code resent" });
});

export const changePassword = asyncErrorHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body as { currentPassword: string; newPassword: string };
  if (!req.user) throw new CustomError("Unauthorized", 401);
  if (!currentPassword || !newPassword) throw new CustomError("Missing fields", 400);

  const user = await User.findById(new mongoose.Types.ObjectId(req.user.id)).select("+password");
  if (!user) throw new CustomError("User not found", 404);

  const isMatch = await bcrypt.compare(currentPassword, (user as any).password);
  if (!isMatch) throw new CustomError("Current password is incorrect", 400);

  if (newPassword.length < 8) throw new CustomError("Password must be at least 8 characters", 400);

  (user as any).password = newPassword;
  await user.save();
  res.status(200).json({ message: "Password changed successfully" });
});
