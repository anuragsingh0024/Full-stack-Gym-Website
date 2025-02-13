import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import authRoute from "./routes/AuthRoutes.js";
import userRoute from "./routes/UserRoutes.js";
import adminRoute from "./routes/AdminRoute.js";
import cors from "cors";
import { seedMemberships } from "./controller/membershipController.js";
import paymentRoutes from "./routes/PaymentRoute.js";
import membershipRoutes from "./routes/MembershipRoute.js";
import cloudinaryConnect from "./config/cloudinaryConnect.js";
import fileUpload from "express-fileupload";

const app = express();
const PORT = process.env.PORT || 4000;
connectDB();
cloudinaryConnect();

const allowedOrigins = [
  "http://localhost:5173",
  "https://full-stack-gym-website-rho.vercel.app",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});




//middlewares
app.use(express.json());
app.use(cookieParser());

app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);



//mount the routes
app.get("/ping", (req, res) => {
  res.send("working");
});
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);

app.use("/api/v1/admin", adminRoute);

app.use("/api/v1/membership", membershipRoutes);

app.use("/api/v1/payment", paymentRoutes);

//listen the server
app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
