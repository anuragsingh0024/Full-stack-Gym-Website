import express from "express";
import {
  signup,
  signin,
  resetPassword,
  resetPasswordToken,
  verifyOtp,
  logout,
} from "../controller/authControler.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/login", signin);
router.delete("/logout", logout);

//reset password routers
router.post("/forgot-password", resetPassword);
router.post("/reset-password/:token", resetPasswordToken);

export default router;
