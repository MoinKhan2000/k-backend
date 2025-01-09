import ApplicationErrorHandler from "../../../utils/errorHandler.js";
import ShopModel from "./shop.model.js";

export const addNewShop = async (newShopData) => {
  try {
    const newShop = new ShopModel(newShopData);
    await newShop.save();
    return newShop;
  } catch (error) {
    throw new ApplicationErrorHandler("Failed to add new shop", 500);
  }
}

export const deleteShop = async (shopId) => {
  try {
    await ShopModel.findByIdAndDelete(shopId);
    return true;
  } catch (error) {
    throw new ApplicationErrorHandler("Failed to delete shop", 500);
  }
}

export const updateShop = async (shopId, updatedShop) => {
  try {
    const updatedShopData = await ShopModel.findByIdAndUpdate(shopId, updatedShop, { new: true });
    if (!updatedShopData) {
      throw new ApplicationErrorHandler("Shop not found", 404);
    }
    return updatedShopData;
  } catch (error) {
    throw new ApplicationErrorHandler("Failed to update shop", 500);
  }
}

export const getAllShops = async () => {
  return await ShopModel.find({});
}

export const getShopById = async (shopId) => {
  return await ShopModel.findById(shopId);
}

export const getShopByUserId = async (userId) => {
  if (!userId) {
    throw new ApplicationErrorHandler("User ID is required", 400);
  }
  return await ShopModel.find({ owner: userId });
}

export const getShopsByCategory = async (categoryId) => {
  return await ShopModel.find({ categories: categoryId });
}
