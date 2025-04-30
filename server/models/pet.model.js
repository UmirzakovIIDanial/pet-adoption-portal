// server/models/pet.model.js
const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  type: {
    type: String,
    required: [true, 'Please provide pet type'],
    enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Guinea Pig', 'Fish', 'Turtle', 'Other']
  },
  breed: {
    type: String,
    required: [true, 'Please provide breed'],
    trim: true
  },
  age: {
    years: {
      type: Number,
      required: [true, 'Please provide age in years'],
      min: [0, 'Age cannot be negative']
    },
    months: {
      type: Number,
      required: [true, 'Please provide age in months'],
      min: [0, 'Months cannot be negative'],
      max: [11, 'Months cannot be more than 11']
    }
  },
  gender: {
    type: String,
    required: [true, 'Please provide gender'],
    enum: ['Male', 'Female', 'Unknown']
  },
  size: {
    type: String,
    required: [true, 'Please provide size'],
    enum: ['Small', 'Medium', 'Large', 'Extra Large']
  },
  color: {
    type: String,
    required: [true, 'Please provide color']
  },
  description: {
    type: String,
    required: [true, 'Please provide description'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  photos: [{
    type: String,
    required: [true, 'Please provide at least one photo']
  }],
  healthStatus: {
    vaccinated: {
      type: Boolean,
      default: false
    },
    neutered: {
      type: Boolean,
      default: false
    },
    medicalConditions: {
      type: String,
      default: 'None'
    }
  },
  behavior: {
    type: String,
    required: [true, 'Please provide behavior information']
  },
  adoptionStatus: {
    type: String,
    enum: ['Available', 'Pending', 'Adopted'],
    default: 'Available'
  },
  shelter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Pet', PetSchema);
