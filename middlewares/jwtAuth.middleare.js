import jwt from 'jsonwebtoken';
import ApplicationErrorHandler from '../utils/errorHandler.js';
import UserModel from '../src/user/models/user.model.js';

const jwtAuth = async (req, res, next) => {
  try {

    const token = req.headers.authorization || req.cookies.token;

    if (!token) {
      return next(new ApplicationErrorHandler('Token is required', 401));
    }

    // Verify the token
    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // If token is invalid, handle the error
    if (!decodedData) {
      return next(new ApplicationErrorHandler('Invalid token', 403));
    }

    // Find the user by decoded ID
    const user = await UserModel.findById(decodedData.user).select('-password');

    // If no user is found
    if (!user) {
      return next(new ApplicationErrorHandler('User not found', 404));
    }

    // Attach user to request object
    req.user = user;

    // Move to next middleware
    next();
  } catch (error) {
    // Catch any other errors (e.g. token expiration or malformed token)
    if (error.name === 'JsonWebTokenError') {
      return next(new ApplicationErrorHandler('Invalid token', 403));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new ApplicationErrorHandler('Token expired', 403));
    }
    // Handle general server errors
    return next(new ApplicationErrorHandler(error.message || 'Server error', error.code || 500));
  }
};
export default jwtAuth