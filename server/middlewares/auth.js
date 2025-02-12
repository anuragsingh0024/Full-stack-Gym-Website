import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../model/User.js";

export const auth = async (req, res, next) => {
  console.log("cookies is: ", req.headers.authorization?.split(" ")[1]);
  try {
    // console.log("auth");
    //get the token

    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1] || // Bearer token from Authorization header
      req.body.token;

    // If JWT is missing, return 401 Unauthorized response
    if (!token) {
      return res.status(403).json({ success: false, message: `Token Missing` });
    }

    try {
      //verify the token
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(
        "Printin in auth middleware after decoding the token",
        decode
      );

      //storing the decode data into req
      req.user = decode;
    } catch (err) {
      console.log("Error while authentication", err.message);

      if (err.name === "TokenExpiredError") {
        console.log("token expired");
        // Handle expired token case
        return res
          .status(401)
          .json({ success: false, message: "Token expired" });
      }
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const isUser = async (req, res, next) => {
  try {
    //fetch the data
    const { email } = req.user;

    //validate
    const user = await User.findOne({ email });
    if (!user.role !== "user") {
      return res.status(400).json({
        success: false,
        message: "This is protected route for user only",
      });
    }
    //next call
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    //fetch the data
    const { id } = req.user;

    //validate
    const user = await User.findById(id);
    if (user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "This is protected route for admin only",
      });
    }
    //next call
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
