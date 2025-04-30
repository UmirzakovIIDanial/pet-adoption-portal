// server/models/adoption.model.js
const mongoose = require('mongoose');

const AdoptionSchema = new mongoose.Schema({
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shelter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
    default: 'Pending'
  },
  applicationDetails: {
    livingArrangement: {
      type: String,
      required: [true, 'Please provide living arrangement information']
    },
    hasChildren: {
      type: Boolean,
      required: [true, 'Please specify if you have children']
    },
    hasOtherPets: {
      type: Boolean,
      required: [true, 'Please specify if you have other pets']
    },
    otherPetsDetails: {
      type: String
    },
    workSchedule: {
      type: String,
      required: [true, 'Please provide work schedule information']
    },
    petCareExperience: {
      type: String,
      required: [true, 'Please provide pet care experience']
    },
    reasonForAdoption: {
      type: String,
      required: [true, 'Please provide reason for adoption']
    },
    vetDetails: {
      name: String,
      phone: String,
      address: String
    },
    references: [{
      name: String,
      relationship: String,
      phone: String,
      email: String
    }]
  },
  approvalDetails: {
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvalDate: Date,
    comments: String,
    homeVisitRequired: {
      type: Boolean,
      default: false
    },
    homeVisitDate: Date,
    homeVisitNotes: String
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Adoption', AdoptionSchema);
