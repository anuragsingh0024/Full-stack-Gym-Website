import Payment from "../model/Payment.js";
import Contact from "../model/Contact.js";
import User from "../model/User.js";
import Product from "../model/Product.js";
import { uploadImageToCloudinary } from "../utils/uploadImageToCloudinary.js";

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Payment.find({}).populate("userId membershipId");

    res.status(200).json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletTransaction = async (req, res) => {
  try {
    const id = req.params.id;
    const transaction = await Payment.findById(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transactioin not found",
      });
    }

    await Payment.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (err) {
    console.log("Error whiel deleting transaction: ", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllContact = async (req, res) => {
  try {
    const allContact = await Contact.find({}).sort({ createdAt: -1 });

    res.status(202).json({
      success: true,
      message: "Contact fetched successfully",
      allContact,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(404).json({
      success: false,
      message: "Contact id not found",
    });
  }

  try {
    const contactDetails = await Contact.findById(id);
    if (!contactDetails) {
      return res.status(404).json({
        success: false,
        message: "Contact Details not found",
      });
    }

    await Contact.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (err) {
    console.log("Error while deleting contact detail: ", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({})
      .select("-password")
      .sort({ membershipStartDate: -1 })
      .populate("memberships");
    res.status(202).json({
      success: true,
      message: "All users fetched successfully",
      allUsers,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(404).json({
      success: false,
      message: "User id not found",
    });
  }

  try {
    const isAdmin = await User.findById(id);
    if (isAdmin.role === "admin") {
      return res.status(404).json({
        success: false,
        message: "You can't delete admin profile",
      });
    }
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.log("Error while deleting user: ", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createProduct = async (req, res) => {
  const { name, description, price, url } = req.body;
  const image = req.files?.image;
  if (!name || !description || !price || !image || !url) {
    return res.status(404).json({
      success: false,
      message: "All details are required",
    });
  }
  const isAlreadyExitingProduct = await Product.find({ name: name });

  if (isAlreadyExitingProduct.length > 0) {
    return res.status(400).json({
      success: false,
      message: "You can't Add multiple product with same name",
    });
  }
  try {
    const uploadedImage = await uploadImageToCloudinary(image);
    if (!uploadedImage.success) {
      return res.status(400).json({
        success: false,
        message: uploadedImage.message || "Failed to upload image",
      });
    }

    await Product.create({
      name,
      price,
      description,
      url,
      image: uploadedImage.url,
    });
    return res.status(200).json({
      success: true,
      message: "Product added successfully",
    });
  } catch (err) {
    console.log("Error while creating product: ", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find({}).sort({ createdAt: -1 });
    if (!allProducts) {
      return res.status(404).json({
        success: false,
        message: "Failed to fetch products",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      allProducts,
    });
  } catch (err) {
    console.log("Error while fetching all products");
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ error: "Product not found" });

    // Delete product from database
    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting product", error });
  }
};

// ✅ EDIT PRODUCT FUNCTION
export const editProduct = async (req, res) => {
  try {
    const { name, price, description, url } = req.body;
    const productId = req.params.id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update fields if provided
    if (name) product.name = name;
    if (price) product.price = price;
    if (description) product.description = description;
    if (url) product.url = url;

    // If a new image is uploaded, update it
    if (req.files) {
      const result = await uploadImageToCloudinary(req.files.image);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message || "Failed to upload image",
        });
      }
      product.image = result.url; // Assuming image is uploaded via Multer & Cloudinary
    }

    // Save updated product
    await product.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Product updated successfully",
        product,
      });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Error updating product" });
  }
};
