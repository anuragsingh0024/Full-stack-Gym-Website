import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  membershipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Membership",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["success", "failed", "pending"],
    default: "pending",
  },
  paymentDate: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("Payment", paymentSchema);
