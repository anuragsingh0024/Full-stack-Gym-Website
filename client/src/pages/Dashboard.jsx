import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/formateDate";
import Loader from "../components/common/Loader";
import toast from "react-hot-toast";
import { setUser } from "../redux/slices/AuthSlice";
import { useDispatch } from "react-redux";
import axiosInstance from "../utils/axiosInstance";

const UserDashboard = () => {
  const [user, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMembership, setNewMembership] = useState("Premium");
  const [isActive, setIsActive] = useState(true);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function fetchUserData() {
    try {
      const response = await axiosInstance.get("/user/get-profile-details", {
        withCredentials: true,
      });
      setUserDetails(response.data.user);
      dispatch(setUser(response.data.user));
    } catch (error) {
      console.log(error);
      toast.error("Authorization Failed, please re-login");
      localStorage.removeItem("token");
      navigate("/auth/signin");
      window.location.reload();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUserData();
  }, [dispatch, navigate]);

  const handleUpdateProfile = async () => {
    if (name === "") {
      toast.error("Name is required!!");
      return;
    }
    if (name.length < 2) {
      toast.error("Name must be minimume 2 characters!!");
      return;
    }
    setIsLoading(true);
    try {
      await axiosInstance.put(
        "/user/update-profile",
        { name: name, email: user.email },
        {
          withCredentials: true,
        }
      );
      toast.success("Profile updated successfully!");
      setIsLoading(false);
      setIsEditOpen(false);
      fetchUserData();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Update failed!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { data } = await axiosInstance.delete("/auth/logout");
      toast.success(data.message);
    } catch (err) {
      toast.error("Something went wrong");
    }

    localStorage.removeItem("token");
    setUserDetails(null);
    navigate("/");
    window.location.reload();
  };

  const handleUpgrade = async () => {
    try {
      setIsSubmiting(true);
      const { data } = await axiosInstance.post(
        "/membership/upgrade-membership",
        { newMembershipType: newMembership },
        { withCredentials: true }
      );
      setIsSubmiting(false);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.upgradePrice * 100,
        currency: "INR",
        name: "Gym Membership Upgrade",
        description: `Upgrade to ${newMembership}`,
        order_id: data.paymentOrder.id,
        handler: async (response) => {
          setIsSubmiting(true);
          await axiosInstance.post(
            "/payment/verify-upgrade-payment",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              newMembershipType: newMembership,
            },
            { withCredentials: true }
          );
          toast.success("Membership upgraded successfully!");
          setIsSubmiting(false);
          fetchUserData();
        },
        theme: { color: "#1DB954" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      toast.error("Error upgrading membership");
      setIsSubmiting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-pure-greys-900">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return (
      <p className="text-center text-red-500">
        Error: Failed to fetch user data.
      </p>
    );
  }

  return (
    <div className="min-h-screen  text-white p-6 flex flex-col items-center">
      {/* Dashboard Header */}
      <div className="max-w-4xl w-full">
        <div className="bg-gradient-to-r from-pure-greys-800 to-pure-greys-700 rounded-2xl p-6 shadow-lg border border-pure-greys-700 backdrop-blur-md flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-caribbeangreen-400">
            Welcome, {user.name} 👋
          </h1>
          <p className="text-pure-greys-400 mt-2">
            Email: <span className="font-semibold text-xl">{user.email}</span>
          </p>
          <p className="text-pure-greys-400">
            Joined on:{" "}
            <span className="font-semibold text-xl">
              {formatDate(user.createdAt)}
            </span>
          </p>
        </div>

        {/* Membership Section */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-6 shadow-lg border border-blue-500 backdrop-blur-md mt-6 flex flex-col">
          <h2 className="text-2xl font-bold text-yellow-400">
            Your Membership
          </h2>
          {user.membershipStartDate ? (
            <div className="mt-4 text-lg flex flex-col gap-3">
              <p className="text-pure-greys-200">
                Type:{" "}
                <span className="text-white font-semibold">
                  {user.memberships.type}
                </span>
              </p>
              <p className="text-pure-greys-200">
                Price:{" "}
                <span className="text-white font-semibold">
                  {user.memberships.price} Rs
                </span>
              </p>
              <p className="text-pure-greys-200">
                Duration:{" "}
                <span className="text-white font-semibold">
                  {user.memberships.duration} Months
                </span>
              </p>
              <p className="text-pure-greys-200">
                Start Date:{" "}
                <span className="text-white font-semibold">
                  {formatDate(user.membershipStartDate)}
                </span>
              </p>
              <p className="text-pure-greys-200">
                End Date:{" "}
                <span className="text-white font-semibold">
                  {formatDate(user.membershipExpirationDate)}
                </span>
              </p>
              <p className={`text-xl font-semibold flex gap-3`}>
                Status:{" "}
                <span
                  className={`${
                    isActive ? "text-caribbeangreen-400" : "text-richblue-200"
                  } uppercase`}
                >
                  {user.membershipStatus}
                </span>
              </p>

              {user.memberships.level < 3 ? (
                <div className="flex gap-5">
                  <h1 className="font-semibold text-2xl mt-5">
                    Upgrade your membership
                  </h1>

                  {user.memberships.level === 1 ? (
                    <select
                      className="bg-transparent outline-none transition-all duration-300 mt-5 border px-5 py-2 rounded-lg"
                      value={newMembership}
                      onChange={(e) => setNewMembership(e.target.value)}
                      name=""
                      id=""
                    >
                      <option className="bg-pure-greys-600" value="Standard">
                        Standard
                      </option>
                      <option className="bg-pure-greys-600" value="Premium">
                        Premium
                      </option>
                    </select>
                  ) : (
                    <select
                      className="bg-transparent outline-none transition-all duration-300 mt-5 border px-5 py-2 rounded-lg"
                      value="Premium"
                      onChange={(e) => setNewMembership(e.target.value)}
                      name=""
                      id=""
                    >
                      <option className="bg-pure-greys-600" value="Premium">
                        Premium
                      </option>
                    </select>
                  )}
                  <button
                    disabled={isSubmiting}
                    onClick={handleUpgrade}
                    className="bg-caribbeancaribbeangreen-400 px-4 py-2 mt-5 font-semibold rounded-lg"
                  >
                    {isSubmiting ? "Upgrading..." : "Upgrade"}
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            <p className="text-pure-greys-400 mt-4">
              You don't have an active membership.{" "}
              <button
                onClick={() => navigate("/membership")}
                className="text-blue-300 hover:underline"
              >
                Explore Memberships
              </button>
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="bg-gradient-to-r from-purple-900 to-purple-700 rounded-2xl p-6 shadow-lg border border-purple-500 backdrop-blur-md mt-6">
          <h2 className="text-2xl font-bold text-brown-400">Quick Actions</h2>
          <div className="flex flex-wrap gap-4 mt-4">
            <button
              onClick={() => setIsEditOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 transition px-5 py-3 rounded-lg font-semibold shadow-md"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 transition px-5 py-3 rounded-lg font-semibold shadow-md"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-pure-greys-800 p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-2xl font-bold text-caribbeangreen-400 text-center">
              Edit Profile
            </h2>

            <div className="mt-6 flex flex-col gap-4">
              <label className="block">
                <span className="text-pure-greys-300">Name</span>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full  mt-2 px-4 py-2 rounded-lg bg-pure-greys-700 text-white border border-pure-greys-600 focus:outline-none focus:ring-2 focus:ring-caribbeangreen-400"
                  required
                />
              </label>

              {/* <label className="block">
                <span className="text-pure-greys-300">Phone</span>
                <input
                  type="text"
                  name="phone"
                  value={editedUser.phone}
                  onChange={handleChange}
                  className="w-full mt-2 px-4 py-2 rounded-lg bg-pure-greys-700 text-white border border-pure-greys-600 focus:outline-none focus:ring-2 focus:ring-caribbeangreen-400"
                />
              </label> */}

              <div className="flex justify-between mt-4">
                <button
                  onClick={handleUpdateProfile}
                  className="bg-caribbeangreen-500 hover:bg-caribbeangreen-600 transition px-5 py-3 rounded-lg font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Save"}
                </button>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="bg-pure-greys-600 hover:bg-pure-greys-700 transition px-5 py-3 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
