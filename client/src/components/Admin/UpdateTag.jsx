import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Loader from "../common/Loader";
import toast from "react-hot-toast";

const UpdateTag = () => {
  const [data, setData] = useState([]); // Store memberships data
  const [loading, setLoading] = useState(false); // Loading state for fetching data
  const [newTag, setNewTag] = useState(""); // State to store new tag input
  const [selectedMembership, setSelectedMembership] = useState(""); // To track selected membership type
  const [oldTag, setOldTag] = useState(""); // To track the tag being edited
  const [openModal, setOpenModal] = useState(false); // Modal open state

  // Fetch memberships and their tags
  const handleApi = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/admin/all-memberships", {
        withCredentials: true,
      });
      setData(data.memberships);
      setLoading(false);
    } catch (err) {
      console.log(
        "Error while fetching memberships data in update tag component"
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    handleApi();
  }, []);

  // Handle Edit Tag
  const handleEditTag = async () => {
    try {
      const response = await axiosInstance.put(
        "/admin/edit-tag",
        {
          type: selectedMembership,
          oldTag,
          newTag,
        },
        { withCredentials: true }
      );
      toast.success(response.data.message);
      handleApi(); // Re-fetch data to update UI
      setOpenModal(false); // Close the modal after editing
    } catch (err) {
      console.log("Error while editing tag:", err);
      alert("Failed to edit tag");
    }
  };

  // Handle Delete Tag
  const handleDeleteTag = async (membershipType, tag) => {
    try {
      const response = await axiosInstance.delete(
        "/admin/delete-tag",
        {
          data: { type: membershipType, tag },
        },
        { withCredentials: true }
      );
      toast.error(response.data.message);
      handleApi(); // Re-fetch data to update UI
    } catch (err) {
      console.log("Error while deleting tag:", err);
      alert("Failed to delete tag");
    }
  };

  // Open Modal for editing a tag
  const openEditModal = (membershipType, tag) => {
    setSelectedMembership(membershipType);
    setOldTag(tag);
    setNewTag(tag); // Pre-fill input with the old tag value
    setOpenModal(true); // Open the modal
  };

  // Close Modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setNewTag(""); // Reset the form input
  };

  return (
    <div className="p-6">
      {loading && <Loader />}

      {/* Membership and Tags Display */}
      <div className="flex flex-col md:w-11/12  w-screen gap-6 text-black">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-trasnparent text-white border p-4 rounded-lg shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4">
              {item.type} Membership
            </h3>
            <ul className="space-y-2">
              {item.tags.map((tag, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span className="text-lg">{tag}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(item.type, tag)}
                      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTag(item.type, tag)}
                      className="bg-yellow-500 text-black py-1 px-3 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Modal for Editing Tag */}
      {openModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center text-black items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">Edit Tag</h2>
            <div className="mb-4">
              <label
                htmlFor="newTag"
                className="block text-sm font-medium text-gray-700"
              >
                New Tag
              </label>
              <input
                type="text"
                id="newTag"
                className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleEditTag}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Update Tag
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 text-black py-2 px-4 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateTag;
