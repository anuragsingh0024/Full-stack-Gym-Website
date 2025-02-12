import mongoose from "mongoose";
import Membership from "../model/Membership.js";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  memberships: {
    type: mongoose.Types.ObjectId,
    ref: "Membership",
  },
  membershipStatus: {
    type: String,
    enum: ["active", "expired"], // Track the status of the user's membership
    default: "active",
  },
  membershipStartDate: { type: Date },
  membershipExpirationDate: { type: Date },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now() },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
});

export default mongoose.model("User", userSchema);
