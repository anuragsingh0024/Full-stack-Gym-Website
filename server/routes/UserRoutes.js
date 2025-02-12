import express from "express";
import {
  createContact,
  editProfile,
  getUserProfile,
  getUserPurchases,
} from "../controller/userController.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.get("/get-profile-details", auth, getUserProfile);
router.get("/purchases", auth, getUserPurchases);
router.put("/update-profile", auth, editProfile);
// router.get("/membership", console.log('Auth middleware next()'), console.log('membership route') );

//contact us
router.post("/create-contact", createContact);

//
export default router;
