import mongoose from "mongoose";
import validator from "validator";

const shopSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Shop title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Shop description is required'],
    trim: true
  },
  size: {
    type: String,
    required: [true, 'Shop size is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Shop location is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Shop price is required'],
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, 'Shop owner is required']
  },
  rentalStatus: {
    type: String,
    enum: ["available", "unavailable"],
    default: "available"
  },
  shopImageUrl: {
    type: String,
    required: [true, 'Shop image is required'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    validate: {
      validator: (value) => validator.isMobilePhone(value),
      message: 'Phone number is not valid',
    }
  },
  email: {
    type: String,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Email address is not valid',
    }
  },
  whatsapp: {
    type: String,
    required: [true, 'WhatsApp number is required'],
    validate: {
      validator: (value) => validator.isMobilePhone(value),
      message: 'WhatsApp number is not valid',
    }
  }
}, {
  timestamps: true,
});

const ShopModel = mongoose.model("Shop", shopSchema);
export default ShopModel;
