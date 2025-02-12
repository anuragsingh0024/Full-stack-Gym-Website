import express from "express";
import { upgradeMembership } from "../controller/membershipController.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

//upgrade membership
router.post("/upgrade-membership", auth, upgradeMembership);

export default router;
