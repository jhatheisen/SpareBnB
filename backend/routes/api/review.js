// backend/routes/api/review.js

const express = require('express');
const router = express.Router();

const { Review, ReviewImage } = require('../../db/models');

router.post('/:id/images', async (req, res) => {
  // authenticate
  if (req.user === null) {
    res.status(401);
    return res.json(
      {
        message: "Authentication required",
        statusCode: 401
      }
    );
  }

  const reviewId = req.params.id;
  const review = await Review.findByPk(reviewId);

  // doesn't exist
  if (!review) {
    res.status(404);
    return res.json(
      {
        message: "Review couldn't be found",
        statusCode: 404
      }
    );
  }

  // not owned by user
  if (review.dataValues.userId !== req.user.id) {
    res.status(403);
    return res.json(
      {
        message: "Forbidden",
        statusCode: 403
      }
    );
  }

  const allImagesForId = await ReviewImage.findAll({
    where: {
      reviewId
    }
  });

  // max images
  if (allImagesForId.length >= 10) {
    res.status(403);
    return res.json(
      {
        message: "Maximum number of images for this resource was reached",
        statusCode: 403
      }
    );
  }

  const { url, previewImage } = req.body;

  const newImage = await ReviewImage.create({
    reviewId,
    url,
    previewImage,
  });

  delete newImage.dataValues.createdAt;
  delete newImage.dataValues.updatedAt;

  return res.json(newImage);

});

router.

module.exports = router;
