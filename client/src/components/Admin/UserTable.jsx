import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatDate } from "../../utils/formateDate.js";
import Loader from "../common/Loader.jsx";
import axiosInstance from "../../utils/axiosInstance.jsx";
import toast from "react-hot-toast";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/admin/all-users", {
          withCredentials: true,
        });
        setUsers(response.data.allUsers);
        console.log(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setIsLoading(fasle);
      }
    };
    fetchUsers();
  }, []);

  // 🔹 Filter users based on search query (by name or email)
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserDelete = async (id) => {
    const confirmation = confirm("Are you sure to delete this user?? ");
    if (confirmation) {
      try {
        var loadingToast = toast.loading("Deleting this user...");
        const response = await axiosInstance.delete(
          `/admin/delete-user/${id}`,
          { withCredentials: true }
        );
        toast.dismiss(loadingToast);
        if (response.data.success) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }

        setUsers(users.filter((us) => us._id !== id));
      } catch (err) {
        console.log("Error while deleting user: ", err);
        toast.dismiss(loadingToast);
        toast.error(err?.response?.data?.message || "Failed to delete");
      }
    } else {
      return;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-900">
        <Loader />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-bold text-caribbeangreen-400 mb-6 text-center">
        User Details
      </h2>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-11/12 flex items-center my-5 justify-center px-5 py-2 rounded-md bg-transparent outline-none border"
        placeholder="Search user by name or email..."
        type="text"
      />
      {filteredUsers.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-pure-greys-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <h3 className="text-xl font-semibold text-caribbeangreen-300">
                  {user.name}
                </h3>
                <p className="text-gray-400">{user.email}</p>
                <p className="text-gray-500 text-sm">
                  Joined: {formatDate(user.createdAt)}
                </p>

                {user.memberships ? (
                  <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                    <h4 className="text-lg font-semibold text-yellow-400">
                      Membership Details
                    </h4>
                    <p className="text-gray-300">
                      Plan: {user.memberships.type}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Status:{" "}
                      <span
                        className={`${
                          user.membershipStatus === "active"
                            ? "text-caribbeangreen-400"
                            : "text-richblue-200"
                        }`}
                      >
                        {user.membershipStatus}
                      </span>
                    </p>
                    <p className="text-gray-500 text-sm">
                      Enroll on: {formatDate(user.membershipStartDate)}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Valid Until: {formatDate(user.membershipExpirationDate)}
                    </p>
                  </div>
                ) : (
                  <p className="text-red-400 mt-4">No active membership</p>
                )}
                <button
                  onClick={() => handleUserDelete(user._id)}
                  className="bg-brown-500 font-semibold rounded-md px-4 py-2 hover:bg-brown-700 transition-all duration-200 w-full"
                >
                  Delete this user
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full flex justify-center mt-11 font-semibold text-3xl">
          <p>No user found with name of : {searchQuery}</p>
        </div>
      )}
    </div>
  );
};

export default UsersList;
