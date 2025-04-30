// server/controllers/user.controller.js
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async.middleware');
const Adoption = require('../models/adoption.model');
const Pet = require('../models/pet.model');
const User = require('../models/user.model');

// @desc    Get user's adoption applications
// @route   GET /api/users/adoptions
// @access  Private
exports.getUserAdoptions = asyncHandler(async (req, res, next) => {
  const adoptions = await Adoption.find({ applicant: req.user.id })
    .populate({
      path: 'pet',
      select: 'name type breed photos adoptionStatus'
    })
    .populate({
      path: 'shelter',
      select: 'name contactPerson'
    });

  res.status(200).json({
    success: true,
    count: adoptions.length,
    data: adoptions
  });
});

// @desc    Submit adoption application
// @route   POST /api/users/adoptions
// @access  Private
exports.submitAdoption = asyncHandler(async (req, res, next) => {
  req.body.applicant = req.user.id;

  const pet = await Pet.findById(req.body.pet);

  if (!pet) {
    return next(
      new ErrorResponse(`Pet not found with id of ${req.body.pet}`, 404)
    );
  }

  if (pet.adoptionStatus !== 'Available') {
    return next(
      new ErrorResponse(`Pet is not available for adoption`, 400)
    );
  }

  req.body.shelter = pet.shelter;

  // Check if user has already applied for this pet
  const existingApplication = await Adoption.findOne({
    applicant: req.user.id,
    pet: req.body.pet
  });

  if (existingApplication) {
    return next(
      new ErrorResponse(
        `You have already submitted an application for this pet`,
        400
      )
    );
  }

  const adoption = await Adoption.create(req.body);

  // Update pet status to pending
  pet.adoptionStatus = 'Pending';
  await pet.save();

  // Add adoption to user's history
  const user = await User.findById(req.user.id);
  user.adoptionHistory.push(adoption._id);
  await user.save();

  res.status(201).json({
    success: true,
    data: adoption
  });
});

// @desc    Get specific adoption application
// @route   GET /api/users/adoptions/:id
// @access  Private
exports.getAdoption = asyncHandler(async (req, res, next) => {
  const adoption = await Adoption.findById(req.params.id)
    .populate({
      path: 'pet',
      select: 'name type breed photos adoptionStatus'
    })
    .populate({
      path: 'shelter',
      select: 'name contactPerson'
    });

  if (!adoption) {
    return next(
      new ErrorResponse(`Adoption not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is the applicant or the shelter
  if (
    adoption.applicant.toString() !== req.user.id &&
    adoption.shelter.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this resource`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: adoption
  });
});

// @desc    Update adoption application (for shelter)
// @route   PUT /api/users/adoptions/:id
// @access  Private (Shelter only)
exports.updateAdoption = asyncHandler(async (req, res, next) => {
  let adoption = await Adoption.findById(req.params.id);

  if (!adoption) {
    return next(
      new ErrorResponse(`Adoption not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is the shelter
  if (
    adoption.shelter.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this application`,
        401
      )
    );
  }

  // Check if status is being updated
  if (req.body.status) {
    const oldStatus = adoption.status;
    const newStatus = req.body.status;

    if (oldStatus !== newStatus) {
      // If approving, set approval details
      if (newStatus === 'Approved') {
        req.body.approvalDetails = {
          ...req.body.approvalDetails,
          approvedBy: req.user.id,
          approvalDate: Date.now()
        };

        // Update pet status
        const pet = await Pet.findById(adoption.pet);
        if (pet) {
          pet.adoptionStatus = 'Pending';
          await pet.save();
        }
      }

      // If completing adoption, update pet status to adopted
      if (newStatus === 'Completed') {
        const pet = await Pet.findById(adoption.pet);
        if (pet) {
          pet.adoptionStatus = 'Adopted';
          await pet.save();
        }
      }

      // If rejecting, reset pet status to available
      if (newStatus === 'Rejected') {
        const pet = await Pet.findById(adoption.pet);
        if (pet) {
          pet.adoptionStatus = 'Available';
          await pet.save();
        }
      }
    }
  }

  req.body.updatedAt = Date.now();

  adoption = await Adoption.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: adoption
  });
});