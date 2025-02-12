import { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";
import Loader from "../common/Loader";
import toast from "react-hot-toast";

const Trainer = () => {
  const [trainers, setTrainers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [trainerData, setTrainerData] = useState({
    id: null,
    name: "",
    experience: "",
    speciality: "",
    image: null,
    profileUrl: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmiting, setIsSubminting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch trainers from backend API

  useEffect(() => {
    fetchTrainerData();
  }, []);

  const fetchTrainerData = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/admin/all-trainers", {
        withCredentials: true,
      });
      console.log("trainer data: ", response);
      setTrainers(response.data.allTrainer);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching trainers:", error);
      setIsLoading(false);
    }
  };

  // Open modal for Add/Edit trainer
  const openModal = (
    trainer = {
      _id: null,
      name: "",
      experience: "",
      speciality: "",
      image: null,
    }
  ) => {
    setTrainerData(trainer);
    setPreviewImage(trainer.image ? trainer.image : null);
    setModalOpen(true);
  };

  // Handle file upload preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setTrainerData({ ...trainerData, image: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  // Save trainer (Add or Update)
  const handleSave = async () => {
    if (
      trainerData.name === "" ||
      trainerData.experience === "" ||
      trainerData.speciality === "" ||
      trainerData.image === null ||
      trainerData.profileUrl === null
    ) {
      toast.error("All fields are required");
      toast.dismiss(loadingToast);
      setIsSubminting(false);
      return;
    }
    const formData = new FormData();
    formData.append("name", trainerData.name);
    formData.append("experience", trainerData.experience);
    formData.append("speciality", trainerData.speciality);
    formData.append("profileUrl", trainerData.profileUrl);
    if (trainerData.image instanceof File) {
      formData.append("image", trainerData.image);
    }

    try {
      setIsSubminting(true);
      if (trainerData._id) {
        let loadingToast = toast.loading("Updating...");
        const response = await axiosInstance.put(
          `/admin/edit-trainer/${trainerData._id}`,
          formData
        );
        setIsSubminting(false);
        if (response.data.success) {
          toast.dismiss(loadingToast);
          toast.success(response.data.message);
          setIsSubminting(false);
        } else {
          toast.dismiss(loadingToast);
          toast.error(response.data.message);
          setIsSubminting(false);
        }
      } else {
        var loadingToast = toast.loading("Adding...");
        const response = await axiosInstance.post(
          "/admin/add-trainer",
          formData
        );
        setIsSubminting(false);
        console.log(response);
        if (response.data.success) {
          toast.dismiss(loadingToast);
          toast.success(response.data.message);
          setIsSubminting(false);
        } else {
          toast.dismiss(loadingToast);
          toast.error(response.data.message);
          setIsSubminting(false);
        }
      }
      fetchTrainerData();
      setModalOpen(false);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.error("Error saving trainer:", error);
      setIsSubminting(false);
    }
  };

  // Delete trainer
  const handleDelete = async (id) => {
    try {
      var toastLoading2 = toast.loading("Deleting...");
      await axiosInstance.delete(`/admin/delete-trainer/${id}`, {
        withCredentials: true,
      });
      toast.dismiss(toastLoading2);
      toast.success("trainer deleted successfully");
      fetchTrainerData();
    } catch (error) {
      console.error("Error deleting trainer:", error);
      toast.dismiss(toastLoading2);
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
    <div className="min-h-screen p-6 bg-pe-greys-900 text-white">
      <div className="max-w-5xl mx-auto bg-pe-greys-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-caribbeangreen-400 mb-4">
          Manage trainers
        </h2>

        {/* Add trainer Button */}
        <button
          className="bg-caribbeangreen-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-caribbeangreen-600"
          onClick={() => openModal()}
        >
          Add Trainer
        </button>

        {/* trainer Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-pure-greys-700 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-pure-greys-600 text-white">
                <th className="p-3 text-left">Profile</th>
                <th className="p-3 text-left">Trainer Name</th>
                <th className="p-3 text-left">Experience</th>
                <th className="p-3 text-left">Expert in</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainers.map((trainer) => (
                <tr
                  key={trainer._id}
                  className="border-b border-pure-greys-600"
                >
                  <td className="p-3">
                    <img
                      src={trainer.image}
                      alt={trainer.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="p-3">{trainer.name}</td>
                  <td className="p-3 text-caribbeangreen-300 font-semibold">
                    {trainer.experience} Years
                  </td>
                  <td className="p-3">{trainer.speciality}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                      onClick={() => openModal(trainer)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-brown-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                      onClick={() => handleDelete(trainer._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit trainer */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-pure-greys-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {trainerData.id ? "Edit trainer" : "Add trainer"}
            </h2>

            {/* Image Preview */}
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-40 object-cover rounded mb-3"
              />
            )}

            {/* trainer Name */}
            <input
              required
              type="text"
              className="w-full p-2 mb-3 rounded bg-pure-greys-700 text-white"
              placeholder="Trainer Name"
              value={trainerData.name}
              onChange={(e) =>
                setTrainerData({ ...trainerData, name: e.target.value })
              }
            />

            {/* trainer experience */}
            <input
              required
              type="number"
              className="w-full p-2 mb-3 rounded bg-pure-greys-700 text-white"
              placeholder="Experience in Years"
              value={trainerData.experience}
              onChange={(e) =>
                setTrainerData({ ...trainerData, experience: e.target.value })
              }
            />

            {/* trainer Description */}
            <textarea
              required
              className="w-full p-2 mb-3 rounded bg-pure-greys-700 text-white"
              placeholder="Expert in..."
              value={trainerData.speciality}
              onChange={(e) =>
                setTrainerData({ ...trainerData, speciality: e.target.value })
              }
            />
            <input
              required
              className="w-full p-2 mb-3 rounded bg-pure-greys-700 text-white"
              placeholder="Social site url"
              value={trainerData.profileUrl}
              onChange={(e) =>
                setTrainerData({ ...trainerData, profileUrl: e.target.value })
              }
            />

            {/* File Upload */}
            <input
              required
              type="file"
              className="w-full p-2 mb-3 bg-pure-greys-700 text-white"
              onChange={handleFileChange}
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                className="bg-pure-greys-500 px-4 py-2 rounded-lg"
                onClick={() => {
                  setModalOpen(false);
                  toast.dismiss(loadingToast);
                }}
              >
                Cancel
              </button>
              <button
                disabled={isSubmiting}
                className="bg-caribbeangreen-500 px-4 py-2 rounded-lg hover:bg-caribbeangreen-600"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trainer;
