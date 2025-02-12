import React, { useState } from "react";
import Footer from "../components/common/Footer";
import toast from "react-hot-toast";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [error, setError] = useState("");

  const validatation = () => {
    if (
      formData.name === "" ||
      formData.email === "" ||
      formData.message === ""
    ) {
      toast.error("All fields are require");
      return false;
    }
    // setError('')
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    //  console.log(formData)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validatation();
    if (!isValid) {
      return;
    }

    try {
      setIsSubmiting(true);

      const response = await axiosInstance.post(
        "/user/create-contact",
        formData
      );

      //  console.log(formData);
      console.log(response);
      toast.success(response.data.message);
      setIsSubmiting(false);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err.response?.data?.message || "Error in signup");
      toast.error(err.response?.data?.message || "Error in signup");
      setIsSubmiting(false);
    }
  };
  return (
    <div className="flex flex-col items-center w-full mt-10">
      <h1 className="font-semibold text-4xl text-caribbeangreen-400 text-center">
        Get in Touch with us
      </h1>
      <h1 className="font-base text-[13px] text-textColorPara my-3 text-center text-wrap w-[60%]">
        Have questions or need assistance? We're here to help! Whether you're
        looking for membership details, training programs, or general inquiries,
        our team at our Gym is ready to assist you. Visit us at our location,
        give us a call, or drop us a message—we’d love to hear from you. Let’s
        connect and take the next step in your fitness journey together!
      </h1>
      <div className="flex flex-row gap-5 w-11/12 mx-auto justify-center my-10">
        <div className="lg:w-[50%] md:block hidden px-5">
          <img
            className="rounded-xl "
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
          />
        </div>
        <form
          onSubmit={handleSubmit}
          className="md:w-1/2 w-full  flex flex-col gap-5 "
          action=""
        >
          <input
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="bg-transparent px-5 py-2 outline-none border rounded-lg"
            type="text"
            placeholder="Enter your name"
          />
          <input
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-transparent px-5 py-2 outline-none border rounded-lg"
            type="email"
            placeholder="Enter your Email"
          />
          <textarea
            name="message"
            id="message"
            value={formData.message}
            onChange={handleChange}
            className="bg-transparent px-5 py-2 outline-none border rounded-lg"
            type="text"
            rows={10}
            placeholder="Enter your Message"
          />

          <button
            className="bg-caribbeangreen-400 py-2 hover:bg-caribbeangreen-700 transition-all duration-500 rounded-lg font-semibold w-full"
            disabled={isSubmiting}
          >
            {isSubmiting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
