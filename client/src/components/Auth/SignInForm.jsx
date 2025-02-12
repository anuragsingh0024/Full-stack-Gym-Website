import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { logIn } from "../../redux/slices/AuthSlice";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";

const SignUpForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (formData.email === "" || formData.password === "") {
      toast.error("All fields are required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      setIsSubmiting(true);
      const response = await axiosInstance.post("/auth/login", formData, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      setIsSubmiting(false);
      dispatch(logIn());
      localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem("role", JSON.stringify(response.data.user.role));
      navigate("/dashboard");
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error in signup");
      setIsSubmiting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-6 sm:px-8 md:px-10 gap-6">
      <h1 className="font-semibold text-2xl sm:text-3xl text-textColor text-center my-5">
        Make your first step with us
      </h1>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="bg-transparent border px-4 py-2 rounded-lg w-full"
        />

        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="bg-transparent border px-4 py-2 rounded-lg w-full"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FaRegEyeSlash /> : <IoEyeOutline />}
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmiting}
          className="bg-secondryButton hover:bg-caribbeangreen-400 px-4 py-2 rounded-lg transition duration-200 font-semibold w-full"
        >
          {isSubmiting ? "Submitting..." : "Sign in"}
        </button>

        <div className="flex flex-col sm:flex-row justify-between w-full text-center">
          <button
            type="button"
            onClick={() => navigate("/auth/signup")}
            className="text-caribbeangreen-400 hover:underline"
          >
            Register ?
          </button>
          <button
            type="button"
            onClick={() => navigate("/auth/forgot-password")}
            className="text-caribbeangreen-400 hover:underline"
          >
            Forgot password
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
