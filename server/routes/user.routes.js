// server/routes/user.routes.js
const express = require('express');
const ErrorResponse = require('../utils/errorResponse');
const Adoption = require('../models/adoption.model');
const {
  getUserAdoptions,
  submitAdoption,
  getAdoption,
  updateAdoption,
  getShelterProfile,
  getShelterAdoptions
} = require('../controllers/user.controller');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router
  .route('/adoptions')
  .get(getUserAdoptions)
  .post(submitAdoption);

router
  .route('/adoptions/:id')
  .get(getAdoption)
  .put(authorize('shelter', 'admin'), updateAdoption);

// Маршрут для получения профиля приюта
router.get('/shelter', authorize('shelter'), getShelterProfile);

// Маршрут для получения заявок на усыновление для приюта
router.get('/shelter/adoptions', authorize('shelter'), getShelterAdoptions);

// Маршрут для получения заявок на усыновление для приюта
router.get('/shelter/adoptions', authorize('shelter'), async (req, res, next) => {
  try {
    const adoptions = await Adoption.find({ shelter: req.user.id })
      .populate({
        path: 'pet',
        select: 'name type breed photos adoptionStatus'
      })
      .populate({
        path: 'applicant',
        select: 'name email phone'
      });

    res.status(200).json({
      success: true,
      count: adoptions.length,
      data: adoptions
    });
  } catch (err) {
    next(new ErrorResponse('Error fetching shelter adoptions', 500));
  }
});

module.exports = router;