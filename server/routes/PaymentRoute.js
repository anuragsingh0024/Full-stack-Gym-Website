import express from "express";
import {
  createOrder,
  payments,
  verifyPayment,
} from "../controller/Payments.js";
import { auth } from "../middlewares/auth.js";
import { verifyUpgradePayment } from "../controller/membershipController.js";

const router = express.Router();

router.post("/capture-payment", auth, createOrder);
router.post("/verify-payment", auth, verifyPayment);

//upgrade verification payment
router.post("/verify-upgrade-payment", auth, verifyUpgradePayment);

export default router;
