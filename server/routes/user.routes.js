// server/routes/user.routes.js
const express = require('express');
const {
  getUserAdoptions,
  submitAdoption,
  getAdoption,
  updateAdoption
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

module.exports = router;