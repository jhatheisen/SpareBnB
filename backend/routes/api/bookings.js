const express = require('express');

const { Spot, User, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

const router = express.Router();

const Sequelize = require('sequelize');

const Op = Sequelize.Op;

// get all bookings for current user
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

  const userId = req.user.id;

  const bookings = await Booking.findAll({
    where: {
      userId
    },
    include: {
      model: Spot,
      attributes: { exclude: ['createdAt', 'updatedAt']}
    }
  });

  return res.json({
    Bookings: bookings
  });
});

// edit booking
router.put('/:id', async (req, res) => {

  // 1. authenticate
  if (req.user === null) {
    res.status(401);
    return res.json(
      {
        message: "Authentication required",
        statusCode: 401
      }
    );
  }

  // 2. check body to be valid

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

  // 3. check if booking exists

  const bookingId = req.params.id;
  const targetBooking = await Booking.findByPk(bookingId);

  // cannot find booking
  if (!targetBooking) {
    res.status(404);
    return res.json({
      message: "Booking couldn't be found",
      statusCode: 404
    });
  }

  const bookingOwner = targetBooking.dataValues.userId;
  const userId = req.user.id;

  // if not your booking
  if (bookingOwner !== userId) {
    res.status(403);
    return res.json({
      message: "Forbidden, cannot edit other people's bookings.",
      statusCode: 403
    });
  }

  const today = new Date();

  const endOfBooking = targetBooking.dataValues.endDate;

  // if booking past end date
  if (endOfBooking < today) {
    res.status(403);
    return res.json({
      message: "Past bookings can't be modified",
      statusCode: 403
    });
  }

  const spotId = targetBooking.dataValues.spotId;

  // where user id is not current users id
  const allSpotBookings = await Booking.findAll({
    where: {
      [Op.and]: [{spotId: spotId}, { id: { [Op.not]: bookingId } }]
    }
  });

  for (booking of allSpotBookings) {
    const bookingErrors = [];

    const otherStart = booking.dataValues.startDate;
    const otherEnd = booking.dataValues.endDate;

    if (otherStart >= startDate && otherStart <= endDate) bookingErrors.push("Start date conflicts with an existing booking");
    if (otherEnd >= startDate && otherEnd <= endDate) bookingErrors.push("End date conflicts with an existing booking");

    if (bookingErrors.length) {
      res.status(403);
      return res.json({
        message: "Sorry, this spot is already booked for the specified dates",
        statusCode: 403,
        errors: bookingErrors
      });
    }
  }

  targetBooking.set({
    startDate,
    endDate
  });

  await targetBooking.save();

  return res.json(targetBooking);
});

// delete a booking
router.delete('/:id', async (req, res) => {

  // 1. authenticate
  if (req.user === null) {
    res.status(401);
    return res.json(
      {
        message: "Authentication required",
        statusCode: 401
      }
    );
  }

  // 2. check if booking exists

  const bookingId = req.params.id;
  const targetBooking = await Booking.findByPk(bookingId);

  // cannot find booking
  if (!targetBooking) {
    res.status(404);
    return res.json({
      message: "Booking couldn't be found",
      statusCode: 404
    });
  }

  const bookingOwner = targetBooking.dataValues.userId;
  const userId = req.user.id;

  // if not your booking
  if (bookingOwner !== userId) {
    res.status(403);
    return res.json({
      message: "Forbidden, cannot delete other people's bookings.",
      statusCode: 403
    });
  }

  // 3. check if booking has started

  const startDate = targetBooking.dataValues.startDate;

  const today = new Date();

  if (startDate <= today) {
    res.status(403);
    return res.json({
      message: "Bookings that have been started can't be deleted",
      statusCode: 403
    });
  }

  await targetBooking.destroy();

  return res.json({
    message: "Successfully deleted",
    statusCode: 200
  });

});

module.exports = router;
