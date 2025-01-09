import UserModel from "./user.model.js";
import ApplicationErrorHandler from "../../../utils/errorHandler.js";
import { sendWelcomeEmail } from "../../../utils/welcomEmail.js";

/** Sign up a new user. */
export const signUpUser = async (user) => {
  try {
    if (await UserModel.findOne({ email: user.email })) {
      throw new ApplicationErrorHandler("User with this email already exists.", 409);
    }
    const newUser = new UserModel(user);
    await newUser.save();
    sendWelcomeEmail(newUser);
    return newUser;
  } catch (error) {
    throw new ApplicationErrorHandler(error.message, error.code || 500);
  }
};

/** Authenticate and log in a user. */
export const loginUser = async (user) => {
  const { email, password } = user;
  console.log(user);
  try {
    const foundUser = await UserModel.findOne({ email });
    if (!foundUser || !(await foundUser.matchPassword(password))) {
      throw new ApplicationErrorHandler("Invalid credentials", 401);
    }
    return foundUser;
  } catch (error) {
    throw new ApplicationErrorHandler(error.message, error.code || 500);
  }
};

/** Find a user by their ID. */
export const findUserByUserId = async (userId) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new ApplicationErrorHandler('User not found', 404);
    }
    return user;
  } catch (error) {
    throw new ApplicationErrorHandler(error.message || 'Could not find user', error.code || 500);
  }
};

/** Find a user by email. */
export const findUserByEmail = async (email) => {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new ApplicationErrorHandler('User not found', 404);
    }
    return user;
  } catch (error) {
    throw new ApplicationErrorHandler(error.message || 'Could not find user', error.code || 500);
  }
};

/** Update a user's password. */
export const updateUserPassword = async (id, oldPassword, newPassword) => {
  try {

    // Find user by ID
    const user = await UserModel.findById(id);
    if (!user) {
      throw new ApplicationErrorHandler('User not found', 404);
    }

    // Verify the old password
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      throw new ApplicationErrorHandler('Invalid old password', 401);
    }

    // Update the user's password
    user.password = newPassword;

    // Save the updated user
    await user.save();

    return user;
  } catch (error) {
    // Handle and rethrow the error using your custom error handler
    throw new ApplicationErrorHandler(error.message || 'Could not update password', error.code || 500);
  }
};


/** Update user details by ID. */
export const updateUserUsingId = async (id, data) => {
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new ApplicationErrorHandler('User not found', 404);
    }

    // Update password if provided
    if (data.password) {
      await updateUserPassword(id, data.password);
    }

    // Update other user data
    const { password, ...updatedData } = data;
    const updatedUser = await UserModel.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });
    return updatedUser;
  } catch (error) {
    throw new ApplicationErrorHandler(error.message || 'Could not update user', error.code || 500);
  }
};

/** Retrieve all users. */
export const getAllUsers = async () => {
  return await UserModel.find({}).select('-password');
};

/** Delete a user by ID. */
export const deleteUser = async (id) => {
  if (!id) {
    throw new ApplicationErrorHandler('User ID is required', 400);
  }
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new ApplicationErrorHandler('User not found', 404);
    }
    await UserModel.findByIdAndDelete(id);
    return user;
  } catch (error) {
    throw new ApplicationErrorHandler(error.message || 'Could not delete user', error.code || 500);
  }
};

/** Find a user for password reset using the token. */
export const findUserForPasswordReset = async (hashtoken) => {
  return await UserModel.findOne({
    resetPasswordToken: hashtoken,
    resetPasswordExpire: { $gt: Date.now() }
  });
};
