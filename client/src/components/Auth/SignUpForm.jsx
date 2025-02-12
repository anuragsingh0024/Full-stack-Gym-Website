import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";
import axiosInstance from '../../utils/axiosInstance'

const SignUpForm = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [otp, setOtp] = useState(""); // OTP field
  const [isOtpSent, setIsOtpSent] = useState(false); // Track OTP step
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !confirmPassword
    ) {
      toast.error("All fields are required");
      return false;
    }
    if (formData.password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      setIsSubmiting(true);
      const response = await axiosInstance.post(
        "/auth/signup",
        { email: formData.email, name: formData.name }
      );

      toast.success(response.data.message);
      setIsOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error in signup");
    } finally {
      setIsSubmiting(false);
    }
  };

  const handleOtpVerify = async () => {
    if (otp.length < 6) {
      toast.error("OTP must be 6 digits");
      return;
    }
    try {
      setIsSubmiting(true);
      const response = await axiosInstance.post(
        "/auth/verify-otp",
        {
          name: formData.name,
          password: formData.password,
          email: formData.email,
          otp,
        }
      );

      toast.success(response.data.message);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error verifying OTP");
    } finally {
      setIsSubmiting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isOtpSent) {
      await handleOtpVerify();
    } else {
      await handleSignUp();
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsResending(true);
      const response = await axiosInstance.post(
        "/auth/signup",
        {
          email: formData.email,
          name: formData.name,
        }
      );

      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error resending OTP");
    } finally {
      setIsResending(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="flex flex-col w-11/12 max-w-md mx-auto justify-center items-center gap-8 py-10">
      <h1 className="font-semibold text-2xl sm:text-3xl text-center text-textColor">
        Make your first step with us
      </h1>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
        {!isOtpSent ? (
          <>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="bg-transparent border px-4 py-2 rounded-lg w-full"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="bg-transparent border px-4 py-2 rounded-lg w-full"
            />

            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="bg-transparent border px-4 py-2 rounded-lg w-full"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaRegEyeSlash /> : <IoEyeOutline />}
              </button>
            </div>

            <div className="relative w-full">
              <input
                type={confirmShowPassword ? "text" : "password"}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="bg-transparent border px-4 py-2 rounded-lg w-full"
              />
              <button
                type="button"
                onClick={() => setConfirmShowPassword(!confirmShowPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                {confirmShowPassword ? <FaRegEyeSlash /> : <IoEyeOutline />}
              </button>
            </div>

            <button
              disabled={isSubmiting}
              className="bg-secondryButton hover:bg-caribbeangreen-400 px-4 py-2 rounded-lg transition duration-200 font-semibold w-full"
            >
              {isSubmiting ? "Submitting..." : "Sign Up"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/auth/signin")}
              className="text-caribbeangreen-400 hover:underline text-center"
            >
              Log in?
            </button>
          </>
        ) : (
          <>
            <h1 className="text-center font-semibold text-caribbeangreen-300 text-lg">
              Enter 6-digit OTP sent to your email
            </h1>
            <input
              type="number"
              placeholder="Enter OTP here..."
              className="bg-transparent border px-4 py-2 rounded-lg w-full"
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              disabled={isSubmiting}
              className="bg-secondryButton hover:bg-caribbeangreen-400 px-4 py-2 rounded-lg transition duration-200 font-semibold w-full"
            >
              {isSubmiting ? "Verifying..." : "Verify"}
            </button>

            <button
              onClick={handleResendOtp}
              disabled={isResending}
              type="button"
              className="text-caribbeangreen-400 hover:underline text-center"
            >
              {isResending ? "Sending..." : "Resend OTP"}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default SignUpForm;
