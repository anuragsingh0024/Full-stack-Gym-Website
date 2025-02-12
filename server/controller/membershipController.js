import Membership from "../model/Membership.js";
import User from "../model/User.js";
import { generateInvoice } from "../utils/invoiceGenrator.js";
import { membershipMailSender } from "../utils/templates/membershipPurchase.js";
import { instance } from "../config/razorpay.js";
import "dotenv/config";
import crypto from "crypto";
import Payment from "../model/Payment.js";
import { generateInvoiceUpgrade } from "../utils/invoiceGenratorUpgrading.js";
import { upgradeMembershipMailSender } from "../utils/templates/membershipUpgrade.js";

export const seedMemberships = async () => {
  console.log("hello");
  const memberships = [
    {
      type: "Basic",
      price: 10, // Example price
      duration: 3,
      tags: ["Access to gym b", "Personal training b"],
      level: 1,
    },
    {
      type: "Standard",
      price: 20,
      duration: 3,
      tags: ["Access to gym c", "Personal training c"],
      level: 2,
    },
    {
      type: "Premium",
      price: 30,
      duration: 3,
      tags: ["Access to gym d", "Personal training d"],
      level: 3,
    },
  ];

  try {
    await Membership.insertMany(memberships);
    console.log("Memberships seeded successfully!");
  } catch (err) {
    console.error("Error seeding memberships:", err);
  }
};
export const allMembership = async (req, res) => {
  try {
    const memberships = await Membership.find({})
      .sort({ level: 1 })
      .populate("tags");

    res.status(200).json({
      success: true,
      message: "all memberhsips fetched successfully",
      memberships,
    });
  } catch (err) {
    console.log("Error while fetching membership: ", err.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const updateMembership = async (req, res) => {
  let { type, price, duration } = req.body;

  if (!type) {
    return res.status(404).json({
      success: false,
      message: "Membership type is required",
    });
  }
  if (price === "" || price < 1) {
    price = Membership.price;
  }
  if (duration === "" || duration < 1) {
    duration = Membership.duration;
  }

  try {
    const membership = await Membership.findOneAndUpdate(
      { type },
      {
        price,
        duration,
      },
      { new: true }
    );

    res.status(202).json({
      success: true,
      message: "Membership updated successfully",
      membership,
    });
  } catch (err) {
    console.log("Error while updating membership: ", err.message);
    res.status(500).json({
      success: true,
      message: "Internal server error",
    });
  }
};

export const addTags = async (req, res) => {
  const { tag, type } = req.body;
  if (!tag || !type) {
    return res.status(404).json({
      success: false,
      message: "Tag or type not found",
    });
  }

  try {
    const checkMembership = await Membership.findOne({ type });

    if (checkMembership.tags.length > 4) {
      return res.status(400).json({
        success: false,
        message: "You can add maximume 5 Tags",
      });
    }

    const membership = await Membership.findOneAndUpdate(
      { type },
      {
        $push: {
          tags: tag,
        },
      },
      { new: true }
    );
    res.status(202).json({
      success: true,
      message: "Tag updated successfully",
      membership,
    });
  } catch (err) {
    console.log("Error while adding tag: ", err.message);
  }
};

export const getAllTags = async (req, res) => {
  const { type } = req.body;
  if (!type) {
    return res.status(404).json({
      success: false,
      message: "Membership type is required",
    });
  }
  try {
    const tags = await Membership.findOne(type).populate("tags");
    res.status(200).json({
      success: true,
      message: "Tags fetched successfully",
      tags,
    });
  } catch (error) {
    console.log("Error while fetching tags: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const editTag = async (req, res) => {
  const { type, oldTag, newTag } = req.body;

  try {
    // Find the membership by type
    const membership = await Membership.findOne({ type });

    if (!membership) {
      return res.status(404).json({ message: "Membership type not found" });
    }

    // Find the index of the old tag
    const tagIndex = membership.tags.indexOf(oldTag);
    if (tagIndex === -1) {
      return res.status(400).json({ message: "Old tag not found" });
    }

    // Replace the old tag with the new tag
    membership.tags[tagIndex] = newTag;

    // Save the updated membership
    await membership.save();

    return res.status(200).json({
      message: "Tag updated successfully",
      updatedTags: membership.tags,
    });
  } catch (err) {
    console.error("Error editing tag: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTag = async (req, res) => {
  const { type, tag } = req.body;

  try {
    // Find the membership by type
    const membership = await Membership.findOne({ type });

    if (!membership) {
      return res.status(404).json({ message: "Membership type not found" });
    }

    // Remove the tag from the tags array
    const tagIndex = membership.tags.indexOf(tag);
    if (tagIndex === -1) {
      return res.status(400).json({ message: "Tag not found" });
    }

    // Remove the tag from the array
    membership.tags.splice(tagIndex, 1);

    // Save the updated membership
    await membership.save();

    return res.status(200).json({
      message: "Tag removed successfully",
      updatedTags: membership.tags,
    });
  } catch (err) {
    console.error("Error deleting tag: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const upgradeMembership = async (req, res) => {
  const { newMembershipType } = req.body;
  const userId = req.user.id;

  if (!newMembershipType) {
    return res.status(404).json({
      success: false,
      message: "New membership type is required",
    });
  }

  try {
    const user = await User.findById(userId).populate("memberships");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    ///fetch from razor pay

    const currentMembership = user.memberships;
    const newMembership = await Membership.findOne({ type: newMembershipType });

    if (!newMembership) {
      return res.status(400).json({
        success: false,
        message: "New membership type not found",
      });
    }

    // Check if the user is upgrading
    if (newMembership.level <= currentMembership.level) {
      return res.status(400).json({
        success: false,
        message: "Cannot downgrade or repurchase the same membership",
      });
    }

    // Calculate remaining days on current membership
    const today = new Date();
    const remainingDays =
      (user.membershipExpirationDate - today) / (1000 * 60 * 60 * 24);

    // Calculate the price adjustment (if needed)
    const dailyPrice =
      currentMembership.price / (30 * currentMembership.duration);
    const remainingBalance = remainingDays * dailyPrice;
    const upgradePrice = Math.floor(
      Math.max(newMembership.price - remainingBalance, 0)
    );

    // Create Razorpay order
    const options = {
      amount: upgradePrice * 100, // Convert to paise
      currency: "INR",
      receipt: `upgrade_${user.name}_${newMembershipType}`,
      notes: { userId, upgrade: true },
    };

    const order = await instance.orders.create(options);

    return res.status(200).json({
      success: true,
      message: "Upgrade order created successfully",
      newMembershipType: newMembership.type,
      paymentOrder: order,
      upgradePrice,
    });
  } catch (err) {
    console.log("Error while upgrading membership: ", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const verifyUpgradePayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    newMembershipType,
  } = req.body;
  const userId = req.user.id;

  try {
    // Verify payment signature
    const webHookSecret = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(webHookSecret.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Payment Signature" });
    }

    const user = await User.findById(userId).populate("memberships");
    const currentMembership = user.memberships.type;

    // Fetch membership details
    const newMembership = await Membership.findOne({ type: newMembershipType });
    if (!newMembership)
      return res
        .status(404)
        .json({ success: false, message: "Membership not found" });

    // Update user membership
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + newMembership.duration);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        memberships: newMembership._id,
        membershipStartDate: new Date(),
        membershipExpirationDate: expirationDate,
        membershipStatus: "active",
      },
      { new: true }
    ).populate("memberships");

    const order = await instance.orders.fetch(razorpay_order_id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Payment order not found",
      });
    }

    await Payment.create({
      userId: userId,
      membershipId: newMembership._id,
      amount: order.amount / 100,
      status: "success",
      paymentDate: new Date(),
    });

    // Generate and send invoice
    const data = {
      currentMembership,
      newMembershipType,
      price: order.amount / 100,
    };
    const pdf = await generateInvoiceUpgrade(updatedUser, data);
    await upgradeMembershipMailSender(updatedUser, pdf, data);

    res.status(200).json({
      success: true,
      message: "Membership upgraded successfully",
      updatedMembership: newMembership.type,
    });
  } catch (err) {
    console.error("Error verifying upgrade payment:", err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
