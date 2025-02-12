import User from "../model/User.js";
import Membership from "../model/Membership.js";
import Contact from "../model/Contact.js";
import { mailSender } from "../utils/mailSender.js";
import {
  contactUsMessage,
  contactUsUserMessage,
} from "../utils/templates/contactUs.js";
import "dotenv/config";

export const getUserProfile = async (req, res) => {
  try {
    // console.log(req.body);
    //get data
    const userId = req.user.id;
    //validate
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id not found",
      });
    }

    const user = await User.findById(userId)
      .select("-password")
      .populate("memberships");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    //send response
    res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getUserPurchases = async (req, res) => {
  try {
    //get data
    const userId = req.user.id;
    //validate
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id not found",
      });
    }

    const purchases = await User.findById(userId)
      .populate("memberships.memberShipId")
      .select("name price duration description");

    console.log("purchases", purchases);

    // If the user does not exist
    if (!purchases) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Send the response
    res.status(200).json({
      success: true,
      message: "User purchases fetched successfully",
      data: purchases.memberships, // Send the populated memberships
      status: purchases.memberships.status,
    });

    //send response
  } catch (err) {
    console.log("Error while fetching user details");
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const createContact = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(404).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const newContact = await Contact.create({ name, email, message });
    await mailSender(
      email,
      "For Contact to our gym",
      contactUsUserMessage(name)
    );
    await mailSender(
      process.env.ADMIN_EMAIL,
      "New message in contact us",
      contactUsMessage(name, email, message)
    );
    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
      newContact,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const editProfile = async (req, res) => {
  const { id } = req.user;
  const { name, email } = req.body;
  try {
    if (!name || !email) {
      return res.status(404).json({
        success: false,
        message: "Details not found",
      });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (name === user.name) {
      return res.status(404).json({
        success: false,
        message: "Please Enter new name",
      });
    }
    await User.findByIdAndUpdate(id, { name });
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.log("Error while updating user details: ", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
