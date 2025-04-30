// server/models/shelter.model.js
const mongoose = require('mongoose');

const ShelterSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a shelter name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true
  },
  website: {
    type: String
  },
  logo: {
    type: String
  },
  photos: [{
    type: String
  }],
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String
  },
  operatingHours: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    open: String,
    close: String,
    isClosed: {
      type: Boolean,
      default: false
    }
  }],
  contactPerson: {
    name: String,
    position: String,
    phone: String,
    email: String
  },
  verified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: [{
    type: String
  }],
  pets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet'
  }],
  adoptionProcesses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Adoption'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Shelter', ShelterSchema);