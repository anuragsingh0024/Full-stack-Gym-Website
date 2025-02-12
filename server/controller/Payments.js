import { instance } from "../config/razorpay.js";
import Membership from "../model/Membership.js";
import crypto from "crypto";
import User from "../model/User.js";
import "dotenv/config";
import { generateInvoice } from "../utils/invoiceGenrator.js";
import { membershipMailSender } from "../utils/templates/membershipPurchase.js";
import Payment from "../model/Payment.js";

export const createOrder = async (req, res) => {
  const { membershipType } = req.body;
  const userId = req.user.id;
  console.log("membership type: ", membershipType);
  console.log("user id: ", userId);
  if (!membershipType) {
    return res.status(404).json({
      success: false,
      message: "Membership type is required",
    });
  }

  try {
    const membershipDetails = await Membership.findOne({
      type: membershipType,
    });

    if (!membershipDetails) {
      return res.status(404).json({
        success: false,
        message: "Membership not found",
      });
    }

    //  console.log('membership details: ', membershipDetails)

    //options for razorpay
    const options = {
      amount: membershipDetails.price * 100, // Amount in paise (multiply by 100 for INR)
      currency: "INR",
      receipt: `receipt_${membershipType}`,
      notes: { userId },
    };

    try {
      console.log("options is : ", options);
      const order = await instance.orders.create(options);

      console.log("Order by razorpay: ", order);

      res.status(200).json({
        success: true,
        message: "Order created successfully",
        membershipType: membershipDetails.type,
        paymentOrder: order,
      });
    } catch (err) {
      console.log("Error while creatig order with options: ", err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  } catch (err) {
    console.log("Error while Creating razorpay order: ", err.message);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    membershipType,
  } = req.body;
  const userId = req.user.id;

  try {
    const webHookSecret = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(webHookSecret.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      //update user membership
      const membershipDetails = await Membership.findOne({
        type: membershipType,
      });
      const expirationDate = new Date();
      expirationDate.setMonth(
        expirationDate.getMonth() + membershipDetails.duration
      );

      await User.findByIdAndUpdate(userId, {
        memberships: membershipDetails._id,
        membershipStartDate: new Date(),
        membershipExpirationDate: expirationDate,
        membershipStatus: "active",
      });

      const userDetails = await User.findById(userId);
      console.log("userdetails is: ", userDetails);

      await Payment.create({
        userId: userId,
        membershipId: membershipDetails._id,
        amount: membershipDetails.price,
        status: "success",
        paymentDate: new Date(),
      });

      const pdf = await generateInvoice(userDetails, membershipDetails);
      await membershipMailSender(userDetails, pdf, membershipDetails);
      res.status(200).json({
        success: true,
        message: "Payment successfull and membership activated",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid Payment signature",
      });
    }
  } catch (err) {
    console.log("Error while verifying payment: ", err.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const payments = async (req, res) => {
  try {
    const allPayments = await Payment.find({})
      .populate("userId")
      .populate("membershipId", "type");

    if (!allPayments) {
      return res.status(404).json({
        success: false,
        message: "Payments not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payments fetched successfully",
      allPayments,
    });
  } catch (err) {
    console.log("Error while fetching payment details: ", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
