import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import axiosInstance from '../../../utils/axiosInstance'

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    if (newPassword === "" || confirNewPassword === "") {
      setMessage("All fields are required");
      return false;
    }

    if (newPassword !== confirNewPassword) {
      setMessage("Passwords do not match");
      return false;
    }

    if (newPassword.length < 8) {
      setMessage("Password must be at least 8 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      toast.error(message);

      return;
    }
    try {
      const response = await axiosInstance.post(
        `/auth/reset-password/${token}`,
        { password: newPassword, token: token }
      );
      console.log(response.data);
      setMessage(response.data.message); // "Password successfully reset"
      if (response.data.success) {
        toast.success("Password reset successfully");
        navigate("/auth/signin");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="w-11/12 flex flex-col items-center justify-center gap-5 my-5">
      <h1 className="text-3xl font-semibold my-5">Reset your password</h1>
      <form onSubmit={handleSubmit} className=" flex flex-col gap-5 " action="">
        <div className="relative">
          <input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            placeholder="Enter new password"
            className="bg-transparent border w-[30vw] px-4 py-2 rounded-lg"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-[49%] transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FaRegEyeSlash /> : <IoEyeOutline />}
          </button>
        </div>

        <div className="relative">
          <input
            value={confirNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            name="password"
            id="cpassword"
            placeholder="Confirm new password"
            className="bg-transparent border w-[30vw] px-4 py-2 rounded-lg"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-[49%] transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FaRegEyeSlash /> : <IoEyeOutline />}
          </button>
        </div>

        <button
          disabled={isSubmiting}
          className="bg-caribbeangreen-400 font-semibold w-[30vw] py-2 rounded-lg"
        >
          {isSubmiting ? "Submiting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
