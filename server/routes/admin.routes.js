// server/routes/admin.routes.js
const express = require('express');
const {
  getUsers,
  getShelters,
  getAdoptions,
  getStatistics,
  verifyShelter,
  rejectShelter
} = require('../controllers/admin.controller');

const User = require('../models/user.model');
const Shelter = require('../models/shelter.model');
const Adoption = require('../models/adoption.model');
const Pet = require('../models/pet.model');
const advancedResults = require('../middleware/advancedResults.middleware');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/users', advancedResults(User), getUsers);
router.get('/shelters', advancedResults(Shelter, {
  path: 'user',
  select: 'name email'
}), getShelters);
router.get('/adoptions', advancedResults(Adoption, [
  { path: 'pet', select: 'name type photos' },
  { path: 'applicant', select: 'name email' },
  { path: 'shelter', select: 'name' }
]), getAdoptions);
router.get('/statistics', getStatistics);
router.put('/shelters/:id/verify', verifyShelter);
router.put('/shelters/:id/reject', rejectShelter);

module.exports = router;