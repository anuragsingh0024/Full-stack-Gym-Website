import User from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { mailSender } from "../utils/mailSender.js";
import welcomeMessage from "../utils/templates/welcomeTemplate.js";
import Otp from "../model/Otp.js";
import otpMail from "../utils/templates/otpTemplate.js";
import resetPasswordMail from "../utils/templates/resetPassword.js";

const signup = async (req, res) => {
  try {
    //get the data
    const { email, name } = req.body;

    //validate the data
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    //check user already registered or not
    const exitingUser = await User.findOne({ email });

    if (exitingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    //generate otp
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    //make otp entry in db
    await Otp.create({
      otp,
      otpExpires: otpExpires,
    });
    //make a entry in db
    // const newUser = await User.create({
    //   name,
    //   email,
    //   password: hashedPassword,
    //   resetPasswordToken: otp,
    //   resetPasswordExpires: otpExpires
    // });

    //send otp mail
    const message = `Your OTP for signup is: ${otp}. It is valid for 10 minutes.`;
    await mailSender(email, "Verify Your Email", otpMail(name, otp));
    //send response
    res.status(201).json({
      success: true,
      message: "Otp sent successfully to your email",
    });

    // await mailSender(email, "Welcome to our website", welcomeMessage(name));
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// OTP verification controller
export const verifyOtp = async (req, res) => {
  try {
    const { name, email, otp, password } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "otp is required",
      });
    }
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    if (!email || !password || !name) {
      return res.status(404).json({
        suceess: false,
        message: " All fields require",
      });
    }

    const userOtp = await Otp.findOne({ otp: otp });

    if (!userOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid otp",
      });
    }

    // Check if OTP matches and is not expired
    if (userOtp.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "This otp is expired",
      });
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //make a entry in db
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // OTP is valid, clear OTP fields and activate user
    await Otp.findOneAndDelete({ otp }, { new: true });

    const ctaUrl = "http://localhost:5173/auth/signin";
    await mailSender(
      email,
      "Welcome to our website",
      welcomeMessage(name, ctaUrl)
    );

    res.status(200).json({
      success: true,
      message: "OTP verified. Signup successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const signin = async (req, res) => {
  try {
    //get the data
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fields are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "This email is not registered with us",
      });
    }

    //match the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Password is incorrect",
      });
    }
    //creat token
    const payload = {
      id: user._id,
      role: user.role,
    };
    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    //send response
    const options = {
      // expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      maxAge: 259200000, // expired in 3 days
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.cookie("token", token, options).status(200).json({
      success: true,
      message: "Loged in successfully",
      token,
      user,
    });
  } catch (err) {
    console.log("error while sign in controller: ", err.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "This email is not registered with us",
      });
    }

    //genrate the reset password token
    const resetPasswordToken = crypto.randomUUID(20).toString("hex");
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );
    console.log(updatedDetails);
    const resetUrl = `http://localhost:5173/auth/reset-password/${resetPasswordToken}`;

    await mailSender(
      user.email,
      "Reset Password mail",
      resetPasswordMail(updatedDetails.name, resetUrl)
    );

    res.status(202).json({
      success: true,
      message: "Password reset link successfully sent to your email",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const resetPasswordToken = async (req, res) => {
  try {
    const { token } = req.body || req.params;
    const { password } = req.body;

    const userDetails = await User.findOne({ resetPasswordToken: token });

    if (!userDetails) {
      console.log("token: ", token);
      console.log("query result: ", userDetails);
      return res.status(404).json({
        success: false,
        message: "Token in invalid",
      });
    }

    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token is expired !!",
      });
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // password update
    await User.findOneAndUpdate(
      { resetPasswordToken: token },
      {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
      { new: true }
    );
    // user.password = hashedPassword;
    // user.resetPasswordToken = undefined;
    // user.resetPasswordExpires = undefined;

    // await user.save()

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// logoutController.js

export const logout = (req, res) => {
  console.log("requesting for logout");
  res.clearCookie("token"); // or the name of your session cookie
  return res.status(200).json({ message: "Logged out successfully!" });
};

export { signin, signup, resetPassword, resetPasswordToken };
