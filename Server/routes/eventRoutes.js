const express = require("express");
const eventController = require("../controllers/eventController");
const authController = require("../middlewares/auth");
const seatRouter = require("./seatRoutes");

const router = express.Router();

router.use("/:eventId/seats", seatRouter);

router
  .route("/")
  .get(eventController.getAllEvents)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    eventController.createEvent
  );

router
  .route("/:id")
  .get(eventController.getEvent)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    eventController.updateEvent
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    eventController.deleteEvent
  );

module.exports = router;
