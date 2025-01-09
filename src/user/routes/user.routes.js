import express from 'express';
import { body, validationResult } from 'express-validator';
import ApplicationErrorHandler from '../../../utils/errorHandler.js';
import upload from '../../../middlewares/multer.middleware.js';
import jwtAuth from '../../../middlewares/jwtAuth.middleare.js';

import {
  deleteUserUsingId,
  findAllUsers,
  findUserById,
  forgetPassword,
  getLoggedInUser,
  resetUserPassword,
  signIn,
  signOut,
  signUp,
  updateUser,
  updateUserPasswordOnly
} from '../controller/user.controller.js';

const userRouter = express.Router();

// Validation rules for user signup
const signUpValidationRules = [
  body('name')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters long'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 5 })
    .withMessage('Password must be at least 5 characters long')
];

// Validation rules for user signin
const signInValidationRules = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 5 })
    .withMessage('Password must be at least 5 characters long')
];

// Validation rules for changing password
const changePasswordValidationRules = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId().withMessage('Invalid user ID'),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
];

// Middleware to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = errors.array().map(error => error.msg).join(', ');
    return next(new ApplicationErrorHandler(errorMessage, 400));
  }
  next();
};

// Route to sign up a new user
userRouter.post('/signup', signUp);

// Route to sign in an existing user
userRouter.post('/signin', signIn);

// Route to sign out the currently logged-in user
userRouter.post('/signout', jwtAuth, signOut);

// Route to get the details of the logged-in user
userRouter.post('/getuserdetails', jwtAuth, getLoggedInUser);

// Route to handle forgot password requests
userRouter.post('/password/forgetpassword', forgetPassword);

// Route to find a user by their ID
userRouter.get('/finduser/:userId', findUserById);

// Route to update user details (requires authentication)
userRouter.post('/update', jwtAuth, updateUser);

// Route to change password (requires authentication)
userRouter.post('/updatepassword', jwtAuth, updateUserPasswordOnly);

// Route to reset password (requires authentication)
userRouter.put('/password/reset/:token', jwtAuth, resetUserPassword);

// Route to get a list of all users (requires authentication)
userRouter.get('/allusers', findAllUsers);

// Route to delete a user by their ID
userRouter.delete('/:userId', deleteUserUsingId);

export default userRouter;
