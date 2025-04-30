// server/controllers/admin.controller.js
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async.middleware');
const User = require('../models/user.model');
const Pet = require('../models/pet.model');
const Adoption = require('../models/adoption.model');
const Shelter = require('../models/shelter.model');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get all shelters
// @route   GET /api/admin/shelters
// @access  Private (Admin only)
exports.getShelters = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get all adoptions
// @route   GET /api/admin/adoptions
// @access  Private (Admin only)
exports.getAdoptions = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get adoption statistics
// @route   GET /api/admin/statistics
// @access  Private (Admin only)
exports.getStatistics = asyncHandler(async (req, res, next) => {
  const totalUsers = await User.countDocuments({ role: 'user' });
  const totalShelters = await User.countDocuments({ role: 'shelter' });
  const totalPets = await Pet.countDocuments();
  const availablePets = await Pet.countDocuments({ adoptionStatus: 'Available' });
  const adoptedPets = await Pet.countDocuments({ adoptionStatus: 'Adopted' });
  const pendingPets = await Pet.countDocuments({ adoptionStatus: 'Pending' });
  const totalAdoptions = await Adoption.countDocuments();
  const pendingAdoptions = await Adoption.countDocuments({ status: 'Pending' });
  const approvedAdoptions = await Adoption.countDocuments({ status: 'Approved' });
  const rejectedAdoptions = await Adoption.countDocuments({ status: 'Rejected' });
  const completedAdoptions = await Adoption.countDocuments({ status: 'Completed' });

  // Get pet types distribution
  const petTypes = await Pet.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 }
      }
    }
  ]);

  // Monthly statistics for the past year
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const monthlyAdoptions = await Adoption.aggregate([
    {
      $match: {
        submittedAt: { $gte: oneYearAgo }
      }
    },
    {
      $group: {
        _id: {
          month: { $month: '$submittedAt' },
          year: { $year: '$submittedAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);

  const monthlyNewPets = await Pet.aggregate([
    {
      $match: {
        createdAt: { $gte: oneYearAgo }
      }
    },
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      users: {
        total: totalUsers + totalShelters,
        regularUsers: totalUsers,
        shelters: totalShelters
      },
      pets: {
        total: totalPets,
        available: availablePets,
        adopted: adoptedPets,
        pending: pendingPets,
        byType: petTypes
      },
      adoptions: {
        total: totalAdoptions,
        pending: pendingAdoptions,
        approved: approvedAdoptions,
        rejected: rejectedAdoptions,
        completed: completedAdoptions,
        monthly: monthlyAdoptions
      },
      newPets: {
        monthly: monthlyNewPets
      }
    }
  });
});

// @desc    Verify shelter
// @route   PUT /api/admin/shelters/:id/verify
// @access  Private (Admin only)
exports.verifyShelter = asyncHandler(async (req, res, next) => {
  const shelter = await Shelter.findById(req.params.id);

  if (!shelter) {
    return next(
      new ErrorResponse(`Shelter not found with id of ${req.params.id}`, 404)
    );
  }

  shelter.verified = true;
  await shelter.save();

  res.status(200).json({
    success: true,
    data: shelter
  });
});

// @desc    Reject shelter verification
// @route   PUT /api/admin/shelters/:id/reject
// @access  Private (Admin only)
exports.rejectShelter = asyncHandler(async (req, res, next) => {
  const shelter = await Shelter.findById(req.params.id);

  if (!shelter) {
    return next(
      new ErrorResponse(`Shelter not found with id of ${req.params.id}`, 404)
    );
  }

  shelter.verified = false;
  await shelter.save();

  res.status(200).json({
    success: true,
    data: shelter
  });
});
