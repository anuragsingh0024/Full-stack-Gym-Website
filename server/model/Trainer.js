import mongoose from "mongoose";
const trainerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  speciality: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  }, // Experience in years
  image: {
    type: String,
    required: true,
  },
  profileUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Trainer", trainerSchema);
