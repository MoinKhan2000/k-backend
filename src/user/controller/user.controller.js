import uploadOnCloudinary from '../../../utils/cloudinary.js';
import ApplicationErrorHandler from '../../../utils/errorHandler.js';
import sendPasswordResetEmail from '../../../utils/passwordResetEmail.js';
import responseHandler from '../../../utils/responseHandler.js';
import sendToken from '../../../utils/sendToken.js';

import {
  signUpUser,
  loginUser,
  findUserByUserId,
  updateUserUsingId,
  getAllUsers,
  deleteUser,
  findUserByEmail,
  findUserForPasswordReset,
  updateUserPassword
} from '../models/user.repository.js';
import crypto from "crypto";

// Sign up endpoint
export const signUp = async (req, res, next) => {
  try {
    console.log(req.body);

    // const profileImageLocalPath = req.file?.path;
    // console.log(req.file);
    // console.log(req.body);

    // if (profileImageLocalPath) {
    //   const profileUrl = await uploadOnCloudinary(profileImageLocalPath);
    //   req.body.profileImage = profileUrl;
    // } else {
    //   req.body.profileImage = "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    // }
    const newUser = await signUpUser(req.body);
    if (newUser) {
      new responseHandler(201, 'Successfully created new user', newUser, true).sendResponse(res);
    }
  } catch (error) {
    next(error);
  }
};

// Sign in endpoint
export const signIn = async (req, res, next) => {
  try {
    const user = await loginUser(req.body);
    if (user) {
      await sendToken(user, res, 200);
    }
  } catch (error) {
    next(error);
  }
};


// Sign out endpoint
export const signOut = async (req, res, next) => {
  res.status(200)
    .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
    .json({ success: true, message: "Logged out successfully." });
};

// Forget password endpoint
export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return next(new ApplicationErrorHandler("User not found", 404));
    }

    // Generate password reset token
    const resetToken = await user.getResetPasswordToken();
    await user.save();

    const resetPasswordUrl = `http://localhost:${process.env.PORT}/api/v1/users/password/reset/${resetToken}`;
    console.log("resetPasswordUrl-> ", resetPasswordUrl);

    // Send password reset email
    await sendPasswordResetEmail(user, resetPasswordUrl);
    new responseHandler(200, 'Reset Password Link Sent Successfully On Your Registered Email Account.', resetPasswordUrl, true).sendResponse(res);
  } catch (error) {
    next(new ApplicationErrorHandler(error.message || 'Error in sending password reset link', error.code || 500));
  }
};

// Reset password endpoint
export const resetUserPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;
  try {
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await findUserForPasswordReset(resetPasswordToken);
    if (!user) {
      return next(new ApplicationErrorHandler(`Invalid or expired reset token`, 401));
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return next(new ApplicationErrorHandler(`Passwords do not match`, 400));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return new responseHandler(200, 'Password reset successfully.', user, true).sendResponse(res);
  } catch (error) {
    next(new ApplicationErrorHandler(error.message || 'Error during password reset', error.code || 500));
  }
};


// Update Password Only 
export const updateUserPasswordOnly = async (req, res, next) => {
  try {
    const userId = req.user._id
    const { newPassword, oldPassword } = req.body
    const updatedUser = await updateUserPassword(userId, oldPassword, newPassword)

    if (updatedUser) {
      new responseHandler(200, 'Password updated successfully.', updatedUser, true).sendResponse(res);
    } else {
      return next(new ApplicationErrorHandler('Password updated failed', 404));
    }
  } catch (error) {

    next(new ApplicationErrorHandler(error.message || 'Error during Password Changing', error.code || 500));
  }
}
// Update user endpoint
export const updateUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const data = req.body;
    const updatedUser = await updateUserUsingId(userId, data);
    new responseHandler(200, 'Updated successfully', updatedUser, true).sendResponse(res);
  } catch (error) {
    console.log(error);
    next(new ApplicationErrorHandler(error.message || 'Error during Updating User', error.code || 500));
  }
};

// Find user by ID endpoint
export const findUserById = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await findUserByUserId(userId);
    if (!user) {
      return next(new ApplicationErrorHandler('User not found', 404));
    }
    new responseHandler(200, 'User fetched successfully', user, true).sendResponse(res);
  } catch (error) {
    next(error);
  }
};

// Find all users endpoint
export const findAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    new responseHandler(200, 'Fetched all users successfully.', users, true).sendResponse(res);
  } catch (error) {
    next(error);
  }
};

// Delete user by ID endpoint
export const deleteUserUsingId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const deletedUserDetails = await deleteUser(userId);
    new responseHandler(200, 'Deleted successfully', deletedUserDetails, true).sendResponse(res);
  } catch (error) {
    next(error);
  }
};

// Get logged-in user endpoint
export const getLoggedInUser = async (req, res, next) => {
  try {
    new responseHandler(200, 'Fetched the details of logged-in user', req.user, true).sendResponse(res);
  } catch (error) {
    next(new ApplicationErrorHandler(error.message || 'Error during login', error.code || 500));
  }
};
