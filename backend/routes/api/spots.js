const express = require('express');

const { Spot, User, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

const router = express.Router();

const Sequelize = require('sequelize');

const Op = Sequelize.Op;

function validateQuery(page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice) {

  const filter = {};

  const errors = [];

  if (page < 0 || page > 10) errors.push("Page must be between 1 and 10");
  if (size < 0 || size > 20) errors.push("Size must be between 1 and 20");

  // min lat
  if (isNaN(minLat) && minLat) errors.push("Minimum latitude is invalid");
  if (minLat !== undefined) filter.lat = { [Op.gte]: minLat};

  // max lat
  if (isNaN(maxLat) && maxLat) errors.push("Maximum latitude is invalid");
  if (maxLat !== undefined && 'lat' in filter) {
    filter.lat[Op.lte] = maxLat;
  } else if (maxLat !== undefined) {
    filter.lat = { [Op.lte]: maxLat};
  }

  // min lng
  if (isNaN(minLng) && minLng) errors.push("Minimum longitude is invalid");
  if (minLng !== undefined) filter.lng = { [Op.gte]: minLng};

  // max lng
  if (isNaN(maxLng) && maxLng) errors.push("Maximum longitude is invalid");
  if (maxLng !== undefined && 'lng' in filter) {
    filter.lng[Op.lte] = maxLng;
  } else if (maxLng !== undefined) {
    filter.lng = { [Op.lte]: maxLng};
  }

  // minPrice
  if ((isNaN(minPrice) && minPrice) || minPrice < 0) errors.push("Minimum price must be a number greater than or equal to 0");
  if (minPrice !== undefined) filter.price = { [Op.gte]: minPrice};

  //max price
  if ((isNaN(maxPrice) && maxPrice) || maxPrice < 0) errors.push("Maximum price must be a number greater than or equal to 0");
  if (maxPrice !== undefined && 'price' in filter) {
    filter.price[Op.lte] = maxPrice;
  } else if (maxPrice !== undefined) {
    filter.price = { [Op.lte]: maxPrice};
  }

  // if errors exist
  if (errors.length) {
    return errors;
  }

  return filter;
}

// takes in id returns avg rating of all reviews for that spot id
async function getAvgRating(id) {
  const reviews = await Review.findAll({
    where: {
      spotId: id
    }
  });

  let stars = 0;
  let count = 0;

  for (review of reviews) {
    stars += review.dataValues.stars;
    count++;
  }

  const avgRating = stars / count;

  if (isNaN(avgRating)) {
    return -1;
  }

  return avgRating;
}

// get all spots
router.get('/', async (req, res) => {

  // page and size query
  let { page, size } = req.query;

  (!page || isNaN(page)) ? page = 1 : page = parseInt(page);
  (!size || isNaN(size)) ? size = 20 : size = parseInt(size);

  const limit = size;
  const offset = (size * (page - 1));

  // other query
  const { minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

  let validation = validateQuery(page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice);

  if (Array.isArray(validation)) {
    res.status(400);
    return res.json({
      message: "Validation Error",
      statusCode: 400,
      validation
    });
  }

  const filter = validation;

  console.log(filter);

  // aggregate loading
  const spots = await Spot.findAll({
    where: filter,
    limit,
    offset,
  });

  for (spot of spots) {
    const id = spot.dataValues.id

    const avgRating = await getAvgRating(id);

    if (avgRating !== -1) {
      spot.dataValues.avgRating = avgRating;
    }
  }

  return res.json(
    {
    Spots: spots,
    page,
    size
    }
  );
});

// get user spots
router.get('/current', async (req, res) => {

  // authentication 401
  if (req.user === null) {
    res.status(401);
    return res.json(
      {
        message: "Authentication required",
        statusCode: 401
      }
    );
  }

  const spots = await Spot.findAll({
    where: {
      ownerId: req.user.id
    }
  });

  for (spot of spots) {
    const id = spot.dataValues.id
    console.log(id);
    const avgRating = await getAvgRating(id);
    console.log(avgRating);

    if (avgRating !== -1) {
      spot.dataValues.avgRating = avgRating;
      console.log(avgRating);
    }
  }

  return res.json(
    {
    Spots: spots,
    }
  );
});

// get spots by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const spotById = await Spot.findByPk(id, {
    include: [{
      model: User,
      as: 'Owner',
      attributes: ['id', 'firstName', 'lastName']
    },
    {
      model: SpotImage,
      attributes: ['id', 'url', 'preview']
    }]
  });

  if (!spotById) {
    res.status(404);
    return res.json(
      {
        message: "Spot couldn't be found",
        statusCode: 404
      }
    );
  }

  const numReviews = await Review.count({
    where: {
      spotId: id
    }
  })

  if (numReviews) spotById.dataValues.numReviews = numReviews;

  const avgStarRating = await getAvgRating(id);

  if (avgStarRating !== -1) {
    spotById.dataValues.avgStarRating = avgStarRating;
  }

  return res.json(spotById);
});

// validate spot
function validateSpot(address, city, state, country, lat, lng, name, description, price) {
  const errors = [];

  if (!address) errors.push("Street address is required");
  if (!city) errors.push("City is required");
  if (!state) errors.push("State is required");
  if (!country) errors.push("Country is required");
  if (isNaN(lat) || !lat) errors.push("Latitude is not valid");
  if (isNaN(lng) || !lng) errors.push("Longitude is not valid");
  if (!name || name.length < 1 || name.length >= 50) errors.push("Name must be between 1 and 50 characters");
  if (!description) errors.push("Description is required");
  if ((!price || isNaN(price)) || price % 1 !== 0) errors.push("Price per day is required");

  if (errors.length) {
    return {
      "message": "Validation Error",
      "statusCode": 400,
      errors
    }
  }
}

// create new spot
router.post('/', async (req, res) => {

  // authentication 401
  if (req.user === null) {
    res.status(401);
    return res.json(
      {
        message: "Authentication required",
        statusCode: 401
      }
    );
  }

  const {address, city, state, country, lat, lng, name, description, price} = req.body;

  const error = validateSpot(address, city, state, country, lat, lng, name, description, price);

  if (error) {
    res.status(400);
    return res.json(error);
  }

  const newSpot = await Spot.create({
    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  delete newSpot.dataValues.createdAt;
  delete newSpot.dataValues.updatedAt;

  return res.json(newSpot);
});

// add an image to a spot based on spot id
router.post('/:id/images', async (req, res) => {

  // authentication 401
  if (req.user === null) {
    res.status(401);
    return res.json(
      {
        message: "Authentication required",
        statusCode: 401
      }
    );
  }

  const spotId = req.params.id;
  const spot = await Spot.findByPk(spotId);

  // doesn't exist
  if (!spot) {
    res.status(404);
    return res.json(
      {
        message: "Spot couldn't be found",
        statusCode: 404
      }
    );
  }

  // not owned by user
  if (spot.dataValues.ownerId !== req.user.id) {
    res.status(403);
    return res.json(
      {
        message: "Forbidden",
        statusCode: 403
      }
    );
  }

  const { url, preview, previewImage } = req.body;

  const newImg = await SpotImage.create({
    spotId,
    url,
    preview: preview || previewImage,
  });

  delete newImg.dataValues.createdAt;
  delete newImg.dataValues.updatedAt;
  delete newImg.dataValues.spotId;

  return res.json(newImg);
});

// edit a spot
router.put('/:id', async (req, res) => {

  // authentication 401
  if (req.user === null) {
    res.status(401);
    return res.json(
      {
        message: "Authentication required",
        statusCode: 401
      }
    );
  }

  const spotId = req.params.id;
  const spot = await Spot.findByPk(spotId);

  // doesn't exist
  if (!spot) {
    res.status(404);
    return res.json(
      {
        message: "Spot couldn't be found",
        statusCode: 404
      }
    );
  }

  // not owned by user
  if (spot.dataValues.ownerId !== req.user.id) {
    res.status(403);
    return res.json(
      {
        message: "Forbidden",
        statusCode: 403
      }
    );
  }

  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  const error = validateSpot(address, city, state, country, lat, lng, name, description, price);

  if (error) {
    res.status(400);
    return res.json(error);
  }

  spot.set({
    address: address,
    city: city,
    state: state,
    country: country,
    lat: lat,
    lng: lng,
    name: name,
    description: description,
    price: price,
  });

  await spot.save();

  delete spot.dataValues.previewImage;

  return res.json(spot);
});

// delete a spot
router.delete('/:id', async (req, res) => {

  // authentication 401
  if (req.user === null) {
    res.status(401);
    return res.json(
      {
        message: "Authentication required",
        statusCode: 401
      }
    );
  }

  const spotId = req.params.id;
  const spot = await Spot.findByPk(spotId);

  // doesn't exist
  if (!spot) {
    res.status(404);
    return res.json(
      {
        message: "Spot couldn't be found",
        statusCode: 404
      }
    );
  }

  // not owned by user
  if (spot.dataValues.ownerId !== req.user.id) {
    res.status(403);
    return res.json(
      {
        message: "Forbidden, cannot delete other people's Spots",
        statusCode: 403
      }
    );
  }

  spot.destroy();

  return res.json({
    message: "Successfully deleted",
    statusCode: 200
  })
});

// create a review for a spot
router.post('/:id/reviews', async (req, res) => {

  // authentication 401
  if (req.user === null) {
    res.status(401);
    return res.json(
      {
        message: "Authentication required",
        statusCode: 401
      }
    );
  }

  const spotId = Number(req.params.id);
  const spot = await Spot.findByPk(spotId);

  // doesn't exist
  if (!spot) {
    res.status(404);
    return res.json(
      {
        message: "Spot couldn't be found",
        statusCode: 404
      }
    );
  }

  // current user has already reviewed
  const currReview = await Review.findOne({
    where: {
      [Op.and]: [
        {spotId: spotId},
        {userId: req.user.id}
      ]
    }
  });

  if (currReview) {
    res.status(403);
    return res.json(
      {
        message: "User already has a review for this spot",
        statusCode: 403
      }
    );
  }

  const { review, stars } = req.body;

  // body validations
  const errors = [];

  if (!review) errors.push("Review text is required");
  if ((!stars || isNaN(stars)) || (stars < 1 || stars > 5) || stars % 1 != 0) errors.push("Stars must be an integer from 1 to 5");

  if (errors.length) {
    res.status(400);
    return res.json({
      "message": "Validation error",
      "statusCode": 400,
      errors
    });
  }

  const newReview = await Review.create({
    userId: req.user.id,
    spotId,
    review,
    stars
  })

  return res.json(newReview);
});

// get reviews by spot id
router.get('/:id/reviews', async (req, res) => {

  const spotId = req.params.id;
  const spot = await Spot.findByPk(spotId);

  // doesn't exist
  if (!spot) {
    res.status(404);
    return res.json(
      {
        message: "Spot couldn't be found",
        statusCode: 404
      }
    );
  }

  const reviews = await Review.findAll({
    where: {
      spotId: req.params.id
    },
    include: [
      { model: User,
        attributes: { exclude: ['username', 'createdAt', 'updatedAt', 'hashedPassword', 'email'] }
      },
      {
        model: ReviewImage,
        attributes: {exclude: ['createdAt', 'updatedAt', 'previewImage', 'reviewId']}
      }
    ]
  });

  return res.json({Reviews: reviews});
});

// create a booking
router.post('/:id/bookings', async (req, res) => {

  // authentication 401
  if (req.user === null) {
    res.status(401);
    return res.json(
      {
        message: "Authentication required",
        statusCode: 401
      }
    );
  }

  const spotId = Number(req.params.id);
  const spot = await Spot.findByPk(spotId);

  // doesn't exist
  if (!spot) {
    res.status(404);
    return res.json(
      {
        message: "Spot couldn't be found",
        statusCode: 404
      }
    );
  }

  const userId = req.user.id;

  // if owned by user
  if (spot.dataValues.ownerId === userId) {
    res.status(403);
    return res.json(
      {
        message: "Forbidden, the owner cannot book their own spot.",
        statusCode: 403
      }
    );
  }

  let { startDate, endDate } = req.body;

  // null errors
  const errors = [];

  if (!startDate) errors.push("Must have a Start Date");
  if (!endDate) errors.push("Must have a End Date");

  if (errors.length) {
    res.status(400);
    return res.json({
      message: "Validation Error",
      statusCode: 400,
      errors
    });
  }

  // turn to date object
  startDate = new Date(startDate);

  endDate = new Date(endDate);


  // body errors
  if (endDate <= startDate) errors.push("End Date cannot be on or before Start Date");

  if (errors.length) {
    res.status(400);
    return res.json({
      message: "Validation Error",
      statusCode: 400,
      errors
    });
  }

  const allSpotBookings = await Booking.findAll({
    where: {
      spotId: spotId
    }
  });

  for (booking of allSpotBookings) {
    const bookingErrors = [];
    const start = booking.dataValues.startDate;
    const end = booking.dataValues.endDate;

    if (start >= startDate && start <= endDate) bookingErrors.push("Start date conflicts with an existing booking");
    if (end >= startDate && end <= endDate) bookingErrors.push("End date conflicts with an existing booking");
    if (bookingErrors.length) {
      res.status(403);
      return res.json({
        message: "Sorry, this spot is already booked for the specified dates",
        statusCode: 403,
        errors: bookingErrors
      });
    }
  }

  const newBooking = await Booking.create({
    spotId,
    userId,
    startDate,
    endDate
  });

  return res.json(newBooking);
});

// get all bookings for a spot by spotId
router.get('/:id/bookings', async (req, res) => {

  // authentication 401
  if (req.user === null) {
    res.status(401);
    return res.json(
      {
        message: "Authentication required",
        statusCode: 401
      }
    );
  }

  const spotId = req.params.id;
  const spot = await Spot.findByPk(spotId);

  // doesn't exist
  if (!spot) {
    res.status(404);
    return res.json(
      {
        message: "Spot couldn't be found",
        statusCode: 404
      }
    );
  }

  const ownerId = Number(spot.dataValues.ownerId);
  const userId = req.user.id;

  // if you are not owner
  if (ownerId !== userId){
    const bookings = await Booking.findAll({
      where: {
        spotId
      },
      attributes: ['spotId', 'startDate', 'endDate']
    });

    return res.json({Bookings: bookings});

  } else {
    const bookings = await Booking.findAll({
      where: {
        spotId
      },
      include: {
        model: User,
        attributes: ['id', 'firstName', 'lastName',]
      }
    });

    return res.json({Bookings: bookings});
  }

});

module.exports = router;
