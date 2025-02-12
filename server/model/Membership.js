import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Basic", "Standard", "Premium"],
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  tags: [
    {
      type: String,
    },
  ],
  duration: {
    type: Number, // Duration of the membership in months
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Membership", membershipSchema);
