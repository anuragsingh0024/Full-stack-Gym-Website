import Trainer from "../model/Trainer.js";
import { uploadImageToCloudinary } from "../utils/uploadImageToCloudinary.js";

export const addTrainer = async (req, res) => {
  try {
    //fetch the data
    const { name, speciality, experience, profileUrl } = req.body;
    const image = req.files?.image;

    //validate
    if (!name || !speciality || !experience || !profileUrl || !image) {
      return res.status(400).json({
        success: false,
        message: "All fields are requires",
      });
    }

    const isAlreadyExitingTrainer = await Trainer.find({ name: name });

    if (isAlreadyExitingTrainer.length) {
      return res.status(400).json({
        success: false,
        message: "You can't Add multiple Trainer with same name",
      });
    }

    if (experience > 65) {
      return res.status(400).json({
        success: false,
        message: "Enter valid age !!",
      });
    }
    const uploadedImage = await uploadImageToCloudinary(image);

    if (!uploadedImage.success) {
      return res.status(400).json({
        success: false,
        message: uploadedImage.message || "Failed to upload image",
      });
    }

    //make entry
    const newTrainer = await Trainer.create({
      name,
      experience,
      speciality,
      image: uploadedImage.url,
      profileUrl,
    });

    //send response
    res.status(200).json({
      success: true,
      message: "Trainer created successfully",
      newTrainer,
    });
  } catch (error) {
    console.log("Error while adding a trainer", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTrainerDetails = async (req, res) => {
  try {
    //fetch the data
    const { name, speciality, experience, profileUrl } = req.body;

    const trainerId = req.params.id;

    const trainerDetails = await Trainer.findById(trainerId);
    if (!trainerDetails) {
      return res.status(404).json({
        success: false,
        message: "Trainer details not found",
      });
    }

    if (name) trainerDetails.name = name;
    if (speciality) trainerDetails.speciality = speciality;
    if (experience) trainerDetails.experience = experience;
    if (profileUrl) trainerDetails.profileUrl = profileUrl;

    // If a new image is uploaded, update it
    if (req.files) {
      const result = await uploadImageToCloudinary(req.files.image);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message || "Failed to upload image",
        });
      }
      trainerDetails.image = result.url;
    }

    //update
    await trainerDetails.save();
    //send response

    res.status(200).json({
      success: true,
      message: "Trainer updated successfully",
    });
  } catch (error) {
    console.log("Error while updating trainer details: ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    await Trainer.findByIdAndDelete(req.params.id);

    //response
    return res.status(200).json({
      success: true,
      message: "Trainer deleted successfully",
    });
  } catch (error) {
    console.log("Error while deleting trainer: ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllTrainer = async (req, res) => {
  try {
    const allTrainer = await Trainer.find({});

    if (!allTrainer) {
      return res.status(400).json({
        success: false,
        message: "NO Trainer found",
      });
    }

    res.status(200).json({
      success: true,
      message: "All Trainers fetched successfully",
      allTrainer,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
