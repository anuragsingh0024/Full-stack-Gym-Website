import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  otp: {
    type: Number,
    require: true,
  },
  otpExpires: {
    type: Date,
    default: Date.now(),
    expires: 600,
  },
});

export default mongoose.model("Otp", otpSchema);
