// server/controllers/pet.controller.js
const path = require('path');
const fs = require('fs');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async.middleware');
const Pet = require('../models/pet.model');
const Shelter = require('../models/shelter.model');

// @desc    Get all pets
// @route   GET /api/pets
// @access  Public
exports.getPets = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single pet
// @route   GET /api/pets/:id
// @access  Public
exports.getPet = asyncHandler(async (req, res, next) => {
  const pet = await Pet.findById(req.params.id).populate({
    path: 'shelter',
    select: 'name description contactPerson'
  });

  if (!pet) {
    return next(
      new ErrorResponse(`Pet not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: pet
  });
});

// @desc    Create new pet
// @route   POST /api/pets
// @access  Private (Shelter only)
exports.createPet = asyncHandler(async (req, res, next) => {
  // Check if user is a shelter
  if (req.user.role !== 'shelter' && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} is not authorized to add a pet`,
        403
      )
    );
  }

  // Get shelter
  const shelter = await Shelter.findOne({ user: req.user.id });
  
  if (!shelter && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`No shelter found for user ${req.user.id}`, 404)
    );
  }

  // Add shelter to req.body
  req.body.shelter = req.user.id;

  // Handle file upload
  if (!req.files || !req.files.photo) {
    return next(new ErrorResponse(`Please upload a photo`, 400));
  }

  const file = req.files.photo;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > (process.env.MAX_FILE_SIZE || 10000000)) { // Default 10MB if not defined
    return next(
      new ErrorResponse(
        `Please upload an image less than ${(process.env.MAX_FILE_SIZE || 10000000) / 1000000}MB`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${Date.now()}${path.parse(file.name).ext}`;

  // Ensure upload directories exist
  const uploadDir = './public/uploads';
  const petsDir = `${uploadDir}/pets`;
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  if (!fs.existsSync(petsDir)) {
    fs.mkdirSync(petsDir, { recursive: true });
  }

  // Process nested objects
  try {
    if (req.body.age && typeof req.body.age === 'string') {
      req.body.age = JSON.parse(req.body.age);
    }
    
    if (req.body.healthStatus && typeof req.body.healthStatus === 'string') {
      req.body.healthStatus = JSON.parse(req.body.healthStatus);
    }
  } catch (err) {
    return next(new ErrorResponse(`Invalid JSON format for nested objects`, 400));
  }

  // Move file to upload directory
  file.mv(`${petsDir}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload: ${err.message}`, 500));
    }

    try {
      // Add photo to request body
      req.body.photos = [file.name];

      // Create pet record
      const pet = await Pet.create(req.body);

      // Add pet to shelter if shelter exists
      if (shelter) {
        shelter.pets.push(pet._id);
        await shelter.save();
      }

      res.status(201).json({
        success: true,
        data: pet
      });
    } catch (error) {
      // If pet creation fails, remove the uploaded file
      fs.unlink(`${petsDir}/${file.name}`, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error removing file after failed pet creation:', unlinkErr);
        }
      });
      
      next(error);
    }
  });
});

// @desc    Update pet
// @route   PUT /api/pets/:id
// @access  Private (Shelter only)
exports.updatePet = asyncHandler(async (req, res, next) => {
  let pet = await Pet.findById(req.params.id);

  if (!pet) {
    return next(
      new ErrorResponse(`Pet not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is pet owner
  if (
    pet.shelter.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this pet`,
        401
      )
    );
  }

  pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: pet
  });
});

// @desc    Delete pet
// @route   DELETE /api/pets/:id
// @access  Private (Shelter only)
exports.deletePet = asyncHandler(async (req, res, next) => {
  const pet = await Pet.findById(req.params.id);

  if (!pet) {
    return next(
      new ErrorResponse(`Pet not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is pet owner
  if (
    pet.shelter.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this pet`,
        401
      )
    );
  }

  // Remove pet from shelter
  const shelter = await Shelter.findOne({ user: pet.shelter });
  if (shelter) {
    shelter.pets = shelter.pets.filter(
      petId => petId.toString() !== req.params.id
    );
    await shelter.save();
  }

  await pet.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// Добавьте эту функцию в файл server/controllers/pet.controller.js

// @desc    Filter pets based on query parameters
// @route   GET /api/pets/filter
// @access  Public
exports.filterPets = asyncHandler(async (req, res, next) => {
    console.log('Filter request received:', req.query);
    
    const { type, gender, size, minAge, maxAge } = req.query;
    
    // Построим фильтр на основе запроса
    const filter = {};
    
    if (type) filter.type = type;
    if (gender) filter.gender = gender;
    if (size) filter.size = size;
    
    // Обработка возрастных фильтров
    if (minAge || maxAge) {
      filter.$and = [];
      
      if (minAge) {
        const minAgeYears = parseInt(minAge);
        filter.$and.push({
          $or: [
            { 'age.years': { $gt: minAgeYears } },
            { 
              $and: [
                { 'age.years': minAgeYears },
                { 'age.months': { $gte: 0 } }
              ]
            }
          ]
        });
      }
      
      if (maxAge) {
        const maxAgeYears = parseInt(maxAge);
        filter.$and.push({
          $or: [
            { 'age.years': { $lt: maxAgeYears } },
            { 
              $and: [
                { 'age.years': maxAgeYears },
                { 'age.months': { $lte: 11 } }
              ]
            }
          ]
        });
      }
    }
    
    console.log('Using filter:', JSON.stringify(filter, null, 2));
    
    try {
      const pets = await Pet.find(filter).populate({
        path: 'shelter',
        select: 'name description'
      });
      
      res.status(200).json({
        success: true,
        count: pets.length,
        data: pets
      });
    } catch (err) {
      console.error('Error in filter pets:', err);
      next(err);
    }
  });

// @desc    Upload pet photos
// @route   PUT /api/pets/:id/photo
// @access  Private (Shelter only)
exports.petPhotoUpload = asyncHandler(async (req, res, next) => {
  const pet = await Pet.findById(req.params.id);

  if (!pet) {
    return next(
      new ErrorResponse(`Pet not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is pet owner
  if (
    pet.shelter.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this pet`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.photo;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > (process.env.MAX_FILE_SIZE || 10000000)) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${(process.env.MAX_FILE_SIZE || 10000000) / 1000000}MB`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${pet._id}_${Date.now()}${path.parse(file.name).ext}`;

  // Ensure upload directories exist
  const uploadDir = './public/uploads';
  const petsDir = `${uploadDir}/pets`;
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  if (!fs.existsSync(petsDir)) {
    fs.mkdirSync(petsDir, { recursive: true });
  }

  file.mv(`${petsDir}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload: ${err.message}`, 500));
    }

    // Add new photo to pet photos array
    pet.photos.push(file.name);
    await pet.save();

    res.status(200).json({
      success: true,
      data: file.name
    });
  });
});