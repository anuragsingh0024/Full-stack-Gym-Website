import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: { 
        type: String, required: true 

    },
    email: {
        type: String,
         require: true,

    },
    message: {
        type: String,
         require: true,

    },
    createdAt: {
         type: Date, default: Date.now 

    },
  });
  
export default mongoose.model("Contact", contactSchema);
  