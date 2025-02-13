import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import UpdateTag from "./UpdateTag";
import Loader from "../common/Loader";
import axiosInstance from "../../utils/axiosInstance";

const MembershipsTable = () => {
  const [isUpdateMembership, setIsUpdateMembership] = useState(false);
  const [isUpdateTag, setIsUpdateTag] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isSubmitingTag, setIsSubmitingTag] = useState(false);
  const [type, setType] = useState("Basic");
  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const durationRef = useRef("");
  const priceRef = useRef("");
  const tagRef = useRef("");

  const handleFormApi = async () => {
    const price = priceRef.current.value;
    const duration = durationRef.current.value;
    const tag = tagRef.current.value;

    try {
      setIsSubmiting(true);
      const response = await axiosInstance.post(
        "/admin/update-membership",
        {
          type,
          price,
          duration,
        },
        { withCredentials: true }
      );

      //.log(response);
      setIsSubmiting(false);
      toast.success(response.data.message);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Internal server error";
      toast.error(errorMsg);
      return;
    } finally {
      setIsSubmiting(false);
      //  setType('Basic')
    }
  };
  const handleUserApi = async () => {
    try {
      setIsSubmiting(true);
      setIsLoading(true);
      const response = await axiosInstance.get("/admin/all-users", {
        withCredentials: true,
      });

      //.log(response.data.allUsers);
      setUser(response.data.allUsers);
      setIsSubmiting(false);
      setIsLoading(false);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Internal server error";
      toast.error(errorMsg);
      setIsLoading(false);
      return;
    } finally {
      setIsSubmiting(false);
      setIsLoading(false);
      //  setType('Basic')
    }
  };
  const handleTagApi = async () => {
    const tag = tagRef.current.value;
    if (tag === "") {
      toast.error("Tag is required");
      return;
    }
    try {
      setIsSubmitingTag(true);
      const response = await axiosInstance.post(
        "/admin/add-tag",
        { type, tag },
        { withCredentials: true }
      );
      setIsSubmitingTag(false);

      toast.success("Tag Updated successfully");
      //.log(response.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Something went wrong";
      toast.error(errorMessage);
      //.log(errorMessage);
    } finally {
      setIsSubmitingTag(false);
    }
  };
  const email = "anuragsinghrajputksjd@gmail.com";

  useEffect(() => {
    handleUserApi();
    //.log("user is : ", user);
  }, []);

  const RendorSection = useCallback(() => {
    if (isLoading) {
      return (
        <div className="w-full h-screen flex justify-center items-center bg-gray-900">
          <Loader />
        </div>
      );
    }
    if (isUpdateMembership) {
      return (
        <form id="form-control" className="flex flex-col gap-4" action="">
          <select
            required
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-pure-greys-600 rounded-md outline-none px-7 py-2"
            name="type"
            id="type"
          >
            <option value="Basic">Basic</option>
            <option value="Standard">Standard</option>
            <option value="Premium">Premium</option>
          </select>
          <input
            id="price"
            ref={priceRef}
            // onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter the price..."
            className="bg-pure-greys-600 rounded-md px-7 outline-none py-2"
            type="number"
            name="price"
          />
          <input
            name="duration"
            id="duration"
            ref={durationRef}
            // onChange={(e) => setDuration(e.target.value)}
            placeholder="Enter the duration in month..."
            className="bg-pure-greys-600 rounded-md px-7 outline-none py-2"
            type="number"
          />
          <div className="flex gap-5">
            <input
              id="tag"
              name="tag"
              ref={tagRef}
              // onChange={(e) => setTag(e.target.value)}
              placeholder="Enter tag..."
              className="bg-pure-greys-600 rounded-md px-7 outline-none py-2"
              type="text"
            />
            <button
              disabled={isSubmitingTag}
              onClick={handleTagApi}
              className="bg-yellow-400 py-2 px-5 rounded-lg"
              type="button"
            >
              {isSubmitingTag ? "Adding" : "Add tag"}
            </button>
          </div>
          <button
            onClick={handleFormApi}
            disabled={isSubmiting}
            className="bg-caribbeangreen-400 py-3 rounded-lg"
          >
            {isSubmiting ? "Updating..." : "Update"}
          </button>
        </form>
      );
    }
    if (isUpdateTag) {
      return <UpdateTag />;
    } else {
      return (
        <div className="flex flex-col gap-5 w-full items-center px-4">
          <h1 className="text-2xl border-b border-white w-full text-center pb-5 font-semibold text-caribbeangreen-400">
            Enrolled Memberships
          </h1>
          <div className="w-full overflow-x-auto">
            <div className="w-full px-5">
              {/* Table Header (Hidden on Mobile) */}
              <div className="hidden md:grid grid-cols-4 font-bold text-yellow-200 w-full text-left">
                <h1>Name</h1>
                <h1>Email</h1>
                <h1>Plan</h1>
                <h1>Status</h1>
              </div>

              {/* Data Rows */}
              {user.map(
                (users) =>
                  users?.memberships && (
                    <div
                      key={users.email}
                      className="grid grid-cols-1 md:grid-cols-4 font-bold text-white w-full border-t border-gray-500 mt-2 pt-2 text-center md:text-left"
                    >
                      <h1>{users.name}</h1>
                      <h1 className="break-words">
                        {users.email.replace(/(?<=@).*/, "...")}
                      </h1>
                      <h1>{users.memberships.type}</h1>
                      <h1
                        className={`${
                          users.membershipStatus === "active"
                            ? "text-caribbeangreen-400"
                            : "text-textColor"
                        }`}
                      >
                        {users.membershipStatus}
                      </h1>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      );
    }
  });

  return (
    <div className="flex flex-col gap-10">
      <div className="flex gap-5">
        <button
          onClick={() => {
            setIsUpdateMembership(!isUpdateMembership);
            if (isUpdateTag) {
              setIsUpdateTag(false);
            }
          }}
          className="bg-yellow-200 px-9 py-5 font-semibold rounded-lg"
        >
          {!isUpdateMembership ? "Update Membership" : "Cancel update"}
        </button>
        <button
          onClick={() => {
            setIsUpdateTag(!isUpdateTag);
            if (isUpdateMembership) {
              setIsUpdateMembership(false);
            }
          }}
          className="bg-blue-500 px-9 py-5 font-semibold rounded-lg"
        >
          {isUpdateTag ? "Cancel edit tag" : "Edit Tag"}
        </button>
        {/* <button className="bg-yellow-200 px-9 py-5 font-semibold rounded-lg">
          Hello
        </button>
        <button className="bg-yellow-200 px-9 py-5 font-semibold rounded-lg">
          Hello
        </button> */}
      </div>

      <div>
        <RendorSection />
      </div>
    </div>
  );
};

export default MembershipsTable;
