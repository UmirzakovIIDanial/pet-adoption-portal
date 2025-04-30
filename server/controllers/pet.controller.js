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
  req.body.shelter = shelter ? shelter.user : req.user.id;

  // Handle file upload
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.photo;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_SIZE) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_SIZE / 1000000}MB`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${Date.now()}${path.parse(file.name).ext}`;

  // Определим директорию для загрузки
  const uploadDir = process.env.UPLOAD_DIR || './public/uploads';
  
  // Создадим директорию, если она не существует
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
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    req.body.photos = [file.name];

    const pet = await Pet.create(req.body);

    // Add pet to shelter
    shelter.pets.push(pet._id);
    await shelter.save();

    res.status(201).json({
      success: true,
      data: pet
    });
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
  if (file.size > process.env.MAX_FILE_SIZE) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_SIZE / 1000000}MB`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${pet._id}_${Date.now()}${path.parse(file.name).ext}`;

  // Определим директорию для загрузки
  const uploadDir = process.env.UPLOAD_DIR || './public/uploads';
  
  // Создадим директорию, если она не существует
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
      return next(new ErrorResponse(`Problem with file upload`, 500));
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