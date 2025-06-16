import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  sellingPrice: {
    type: Number,
    required: true
  },
  kmsDriven: {
    type: Number,
    required: true
  },
  fuel: {
    type: String,
    enum: ['Petrol', 'Diesel', 'CNG', 'Electric', 'LPG'],
    required: true
  },
  sellerType: {
    type: String,
    enum: ['Dealer', 'Individual', 'Trustmark Dealer'],
    required: true
  },
  transmission: {
    type: String,
    enum: ['Manual', 'Automatic'],
    required: true
  },
  owner: {
    type: String,
    enum: [
      'First Owner',
      'Second Owner',
      'Third Owner',
      'Fourth & Above Owner',
      'Test Drive Car'
    ],
    required: true
  },
  carImage: {
    type: String,
    default: ''  // either a default URL, or user-uploaded image URL
  },
  description: {
    type: String,
    default: ''  // optional field for user-added details
  },
  location: {
    type: String,
    default: ''  // optional field for city/state
  },
  similarCars: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car'
  }],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  }
}, {
  timestamps: true
});

export const Car = mongoose.model("Car", carSchema)