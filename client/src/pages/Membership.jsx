import React, { useEffect, useState } from "react";
import NavBar from "../components/common/NavBar";
import Button from "../components/common/Button";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/slices/AuthSlice";
import Loader from "../components/common/Loader";
import axiosInstance from "../utils/axiosInstance";

const Membership = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const isloggedin = !!token;

  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleApi = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/admin/all-memberships");
      setData(response.data.memberships);
      //.log(response);
      setIsLoading(false);
    } catch (err) {
      //.log(err);
      setIsLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get("/user/get-profile-details", {
        withCredentials: true,
      });

      // //.log('response in mem: ', response)
      setUser(response.data.user);
    } catch (err) {
      toast.error(err?.data?.message);
    }
  };
  // const token = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    handleApi();
    if (isloggedin) {
      //.log("user is log in");
      fetchUser();
    }
  }, []);

  // Razorpay payment handler
  const handlePayment = async (membership) => {
    //.log("user is : ", user);
    if (!isloggedin) {
      toast.error("Please log in first !!");
      navigate("/auth/signin");
      return;
    }
    if (user?.memberships?.level) {
      toast.error(
        "You are already enrolled in membership Go to dashboard if you want to upgrade"
      );
      return;
    }
    try {
      setIsSubmiting(true);
      // //.log(membership)
      // Create order in backend
      const { data: order } = await axiosInstance.post(
        "/payment/capture-payment",
        { membershipType: membership.type },
        {
          withCredentials: true,
        }
      );

      //.log("data is: ", order);
      setIsSubmiting(false);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY, // Replace with your Razorpay Key ID
        amount: order.paymentOrder.amount,
        currency: order.paymentOrder.currency,
        name: "Gym Membership",
        description: `Payment for ${membership.type} membership`,
        order_id: order.paymentOrder.id,
        handler: async (response) => {
          setIsSubmiting(true);
          const paymentData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            membershipType: membership.type,
          };

          // Verify payment
          const { data } = await axiosInstance.post(
            "/payment/verify-payment",
            paymentData,
            {
              withCredentials: true,
            }
          );
          //.log("verify data is : ", data);
          if (data.success) {
            toast.success("Payment Successful membership activated");
            navigate("/dashboard");
          } else {
            toast.error(data?.message || "Payment verification failed");
          }
          // alert(data.message);
          setIsSubmiting(false);
        },
        prefill: {
          name: membership.name, // Replace with actual user name
          email: membership.email, // Replace with actual user email
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      //.error("Error initiating payment:", err.message);
      // alert("Something went wrong. Please try again.");

      toast.error("Something went wrong");
      setIsSubmiting(false);
    }
  };

  if (isLoading || isSubmiting) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-900">
        <Loader />
      </div>
    );
  }
  return (
    <div>
      {/* <NavBar /> */}
      <div className="flex flex-col gap-10 justify-center items-center mt-10 w-11/12 mx-auto px-5 lg:px-10 text-center">
        {/* Header Section */}
        <div>
          <h1 className="font-inter font-bold text-2xl lg:text-4xl text-caribbeangreen-400">
            Our Plans
          </h1>
          <p className="text-textColorPara my-5 text-sm lg:text-base">
            Unlock your fitness potential with our flexible membership plans at
            Anurag's Gym. Whether you're looking for a basic plan or premium
            perks, we have options to suit every fitness level and goal. Enjoy
            access to top-quality equipment, expert trainers, and exclusive
            classes designed to keep you motivated. Join today and take the
            first step toward a healthier, stronger you!
          </p>
        </div>

        {/* Membership Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full justify-center items-center my-5">
          {data.map((card, index) => {
            return (
              <div
                key={index}
                className="flex flex-col gap-5 border px-5 py-5 rounded-lg w-full max-w-sm mx-auto"
              >
                <h1 className="font-inter font-bold text-2xl lg:text-3xl text-textColor">
                  {card.type}{" "}
                  <pre className="text-base font-[40px]">
                    {card.duration} Months
                  </pre>
                </h1>
                <h1 className="font-inter font-bold text-3xl lg:text-4xl text-caribbeangreen-100">
                  Rs {card.price}
                </h1>
                <div className="flex flex-col gap-2 justify-center">
                  {card.tags.map((tag, tagIndex) => {
                    return (
                      <span
                        key={tagIndex}
                        className="text-white px-2 py-1 bg-gray-800 rounded-lg"
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>
                <button
                  disabled={isSubmiting}
                  onClick={() => handlePayment(card)}
                  className="bg-caribbeangreen-400 px-5 py-2 rounded-lg"
                >
                  {isSubmiting ? "Enrolling..." : "Enroll now"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Membership;
