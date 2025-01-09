import mongoose from "mongoose";
import uploadImageOnCloudinary from "../../../utils/cloudinary.js";
import ApplicationErrorHandler from "../../../utils/errorHandler.js";
import responseHandler from "../../../utils/responseHandler.js";

import {
  addNewShop,
  deleteShop,
  getAllShops,
  getShopById,
  getShopByUserId,
  getShopsByCategory,
  updateShop,
} from "../model/shop.repository.js";

// Add New Shop Controller
export const addNewShopController = async (req, res, next) => {
  try {
    const newShopData = req.body;
    newShopData.owner = req.user._id;

    const shopImageLocalPath = req.file?.path;

    if (shopImageLocalPath) {
      const shopImageUrl = await uploadImageOnCloudinary(shopImageLocalPath);
      newShopData.shopImageUrl = shopImageUrl;
    }

    const newShop = await addNewShop(newShopData);

    if (newShop) {
      new responseHandler(201, "Shop created successfully", newShop, true).sendResponse(res);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Delete Shop Controller
export const deleteShopController = async (req, res, next) => {
  try {
    const { shopId } = req.params;
    console.log(shopId);

    const success = await deleteShop(shopId);
    if (success) {
      new responseHandler(200, "Shop deleted successfully", null, true).sendResponse(res);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Update Shop Controller
export const updateShopController = async (req, res, next) => {
  try {
    const { shopId } = req.params;
    const updatedShopData = req.body;
    console.log(updatedShopData);
    console.log(shopId);


    // Check if a new file is uploaded
    if (req.file) {
      const shopImageLocalPath = req.file.path;
      const shopImageUrl = await uploadImageOnCloudinary(shopImageLocalPath);

      // Append the uploaded image URL to the update data
      updatedShopData.shopImageUrl = shopImageUrl;
    }

    const updatedShop = await updateShop(shopId, updatedShopData);
    if (updatedShop) {
      new responseHandler(200, "Shop updated successfully", updatedShop, true).sendResponse(res);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};


// Get All Shops Controller
export const getAllShopsController = async (req, res, next) => {
  try {
    const shops = await getAllShops();
    new responseHandler(200, "Shops retrieved successfully", shops, true).sendResponse(res);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get Shop by ID Controller
export const getShopByIdController = async (req, res, next) => {
  try {
    const { shopId } = req.params;

    const shop = await getShopById(shopId);
    if (!shop) {
      throw new ApplicationErrorHandler("Shop not found", 404);
    }

    new responseHandler(200, "Shop retrieved successfully", shop, true).sendResponse(res);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get Shop by User ID Controller
export const getShopByUserIdController = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApplicationErrorHandler("Invalid User ID", 400);
    }

    const shop = await getShopByUserId(userId);
    if (!shop) {
      throw new ApplicationErrorHandler("Shop not found for this user", 404);
    }

    new responseHandler(200, "Shop retrieved successfully", shop, true).sendResponse(res);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get Shops by Category Controller
export const getShopsByCategoryController = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const shops = await getShopsByCategory(categoryId);
    new responseHandler(200, "Shops retrieved successfully by category", shops, true).sendResponse(res);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
