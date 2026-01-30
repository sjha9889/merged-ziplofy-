import { Router } from "express";
import { adminLogin, adminLoginStep1, changePassword, getMe, verifyAdminLoginOtp, resendAdminLoginOtp } from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";

export const authRouter = Router();

authRouter.get("/me", protect, getMe);
authRouter.post("/admin/login", adminLogin);
authRouter.post("/admin/login-step1", adminLoginStep1);
authRouter.post("/admin/verify-otp", verifyAdminLoginOtp);
authRouter.post("/admin/resend-otp", resendAdminLoginOtp);
authRouter.put("/change-password", protect, changePassword);