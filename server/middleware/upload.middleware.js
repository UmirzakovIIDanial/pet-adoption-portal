// server/middleware/upload.middleware.js (продолжение)
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('./async.middleware');

exports.uploadFile = (field, folder, fileTypes) => asyncHandler(async (req, res, next) => {
  if (!req.files || !req.files[field]) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files[field];

  // Check if file is an image if fileTypes are specified
  if (fileTypes && !fileTypes.includes(file.mimetype)) {
    return next(
      new ErrorResponse(
        `Please upload a valid file (${fileTypes.join(', ')})`,
        400
      )
    );
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_SIZE) {
    return next(
      new ErrorResponse(
        `Please upload a file less than ${process.env.MAX_FILE_SIZE / 1000000}MB`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `${field}_${req.user.id}_${Date.now()}${path.parse(file.name).ext}`;

  file.mv(`${process.env.UPLOAD_DIR}/${folder}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    req.fileUrl = file.name;
    next();
  });
});