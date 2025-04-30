// server/routes/pet.routes.js
const express = require('express');
const {
  getPets,
  getPet,
  createPet,
  updatePet,
  deletePet,
  petPhotoUpload
} = require('../controllers/pet.controller');

const Pet = require('../models/pet.model');
const advancedResults = require('../middleware/advancedResults.middleware');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth.middleware');

router
  .route('/')
  .get(
    advancedResults(Pet, {
      path: 'shelter',
      select: 'name description'
    }),
    getPets
  )
  .post(protect, authorize('shelter', 'admin'), createPet);

router
  .route('/:id')
  .get(getPet)
  .put(protect, authorize('shelter', 'admin'), updatePet)
  .delete(protect, authorize('shelter', 'admin'), deletePet);

router
  .route('/:id/photo')
  .put(protect, authorize('shelter', 'admin'), petPhotoUpload);

module.exports = router;
