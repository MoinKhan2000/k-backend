import express from 'express';
import { body, validationResult } from 'express-validator';
import upload from '../../../middlewares/multer.middleware.js';
import jwtAuth from '../../../middlewares/jwtAuth.middleare.js';
import {
  addNewShopController,
  deleteShopController,
  updateShopController,
  getAllShopsController,
  getShopByIdController,
  getShopByUserIdController,
  getShopsByCategoryController,
} from '../controller/shop.controller.js';
import validator from 'validator';
import ApplicationErrorHandler from '../../../utils/errorHandler.js';

const shopRouter = express.Router();

// Validation rules for adding and updating a shop
const shopValidationRules = [
  body('title')
    .notEmpty()
    .withMessage('Shop title is required')
    .isString()
    .withMessage('Shop title must be a string'),

  body('description')
    .notEmpty()
    .withMessage('Shop description is required')
    .isString()
    .withMessage('Shop description must be a string'),

  body('size')
    .notEmpty()
    .withMessage('Shop size is required')
    .isString()
    .withMessage('Shop size must be a string'),

  body('location')
    .notEmpty()
    .withMessage('Shop location is required')
    .isString()
    .withMessage('Shop location must be a string'),

  body('price')
    .notEmpty()
    .withMessage('Shop price is required')
    .isNumeric()
    .withMessage('Shop price must be a number'),

  body('rentalStatus')
    .optional()
    .isIn(['available', 'unavailable'])
    .withMessage('Rental status must be either "available" or "unavailable"'),

  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .custom((value) => {
      if (!validator.isMobilePhone(value)) {
        throw new Error('Phone number is not valid');
      }
      return true;
    }),

  body('email')
    .optional()
    .custom((value) => {
      if (value && !validator.isEmail(value)) {
        throw new Error('Email address is not valid');
      }
      return true;
    }),

  body('whatsapp')
    .notEmpty()
    .withMessage('WhatsApp number is required')
    .custom((value) => {
      if (!validator.isMobilePhone(value)) {
        throw new Error('WhatsApp number is not valid');
      }
      return true;
    }),
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = errors.array().map((error) => error.msg).join(', ');
    return next(new ApplicationErrorHandler(errorMessage, 400));
  }
  next();
};

// Add a new shop
shopRouter.post('/', jwtAuth, upload.single('shopImageUrl'), shopValidationRules, handleValidationErrors, addNewShopController);

// Update an existing shop
shopRouter.put('/:shopId', jwtAuth, upload.single('shopImageUrl'), shopValidationRules, handleValidationErrors, updateShopController);

// Delete a shop
shopRouter.delete('/:shopId', jwtAuth, deleteShopController);

// Get all shops
shopRouter.get('/', getAllShopsController);

// Get a shop by ID
shopRouter.get('/:shopId', getShopByIdController);

// Get shops by user ID
shopRouter.post('/user', jwtAuth, getShopByUserIdController);

// Get shops by category
shopRouter.get('/category/:categoryId', getShopsByCategoryController);

export default shopRouter;
