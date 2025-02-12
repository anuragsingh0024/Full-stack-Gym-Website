import express from "express";
import {
  createProduct,
  deleteContact,
  deleteProduct,
  deleteUser,
  deletTransaction,
  editProduct,
  getAllContact,
  getAllProducts,
  getAllUsers,
} from "../controller/admimController.js";
import {
  addTags,
  allMembership,
  deleteTag,
  editTag,
  updateMembership,
} from "../controller/membershipController.js";
import { payments } from "../controller/Payments.js";
import { auth, isAdmin } from "../middlewares/auth.js";
import {
  addTrainer,
  deleteTrainer,
  getAllTrainer,
  updateTrainerDetails,
} from "../controller/trainerController.js";

const router = express.Router();

//contact routes
router.get("/contact/allContact", auth, isAdmin, getAllContact);
router.delete("/contact/delete-contact/:id", auth, isAdmin, deleteContact);

//user routes
router.get("/all-users", auth, isAdmin, getAllUsers);
router.delete("/delete-user/:id", auth, isAdmin, deleteUser);

//all memberships for all user{public route}
router.get("/all-memberships", allMembership);

//membership routes
router.post("/update-membership", auth, isAdmin, updateMembership);
router.post("/add-tag", auth, isAdmin, addTags);
router.delete("/delete-tag", auth, isAdmin, deleteTag);
router.put("/edit-tag", auth, isAdmin, editTag);

//transactions route
router.get("/payments", auth, isAdmin, payments);
router.delete("/delete-transaction/:id", auth, isAdmin, deletTransaction);

//product routes
router.post("/add-product", auth, isAdmin, createProduct);
router.get("/all-products", getAllProducts);
router.delete("/delete-product/:id", auth, isAdmin, deleteProduct);
router.put("/edit-product/:id", auth, isAdmin, editProduct);

//Trainer routes
router.post("/add-trainer", auth, isAdmin, addTrainer);
router.put("/edit-trainer/:id", auth, isAdmin, updateTrainerDetails);
router.get("/all-trainers", getAllTrainer);
router.delete("/delete-trainer/:id", auth, isAdmin, deleteTrainer);
export default router;
