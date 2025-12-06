const express = require("express");
const seatController = require("../controllers/seatController");
const authController = require("../middlewares/auth");

// mergeParams is set to true as the route will be nested
// Like: /api/v1/events/:eventId/seats
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(seatController.getSeats)
  .post(authController.protect, seatController.bookSeats);

module.exports = router;
