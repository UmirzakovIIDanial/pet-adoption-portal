// server/routes/pet.routes.js
const express = require('express');
const {
  getPets,
  getPet,
  createPet,
  updatePet,
  deletePet,
  petPhotoUpload,
  filterPets // Добавим новый контроллер
} = require('../controllers/pet.controller');

const Pet = require('../models/pet.model');
const advancedResults = require('../middleware/advancedResults.middleware');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth.middleware');

// Добавим новый маршрут для фильтрации
router.get('/filter', filterPets);

router
  .route('/')
  .get(
    (req, res, next) => {
      // Обработка фильтров перед advancedResults
      const { type, gender, size, minAge, maxAge } = req.query;
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
      
      // Устанавливаем фильтр в req.advancedQuery
      req.advancedQuery = filter;
      next();
    },
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