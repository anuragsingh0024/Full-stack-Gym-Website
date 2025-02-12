import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { use } from "react";
import axiosInstance from '../../../utils/axiosInstance'

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);

  const handleSubmit = async (e) => {
    if (email == "") {
      toast.error("Please Enter your mail");
      return;
    }
    e.preventDefault();

    try {
      setIsSubmiting(true);
      const response = await axiosInstance.post(
        "/auth/forgot-password",
        { email }
      );
      setMessage(response.data.message); // "Email sent with password reset instructions"
      if (response.data.success) {
        toast.success("Password reset link sent successfully");
        setEmail("");
      } else {
        toast(message);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
      toast.error(message);
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <div className="w-11/12 md:w-full flex flex-col items-center justify-center gap-5 my-5">
      <h1 className="text-3xl font-semibold my-5">Forgot password</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" action="">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          className="bg-transparent w-full  border px-4 py-2 rounded-lg"
        />

        <button
          type="submit"
          disabled={isSubmiting}
          className="bg-secondryButton hover:bg-caribbeangreen-400 px-4 py-2 rounded-lg transition duration-200 font-semibold w-[30vw]"
        >
          {isSubmiting ? "Submitting..." : "Reset"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
