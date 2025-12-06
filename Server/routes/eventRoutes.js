const express = require("express");
const seatRouter = require("./seatRoutes");
const eventController = require("../controllers/eventController");

const router = express.Router();

router
  .route("/")
  .get(eventController.getAllEvents)
  .post(eventController.createEvent);

router
  .route("/:id")
  .get(eventController.getEvent)
  .patch(eventController.updateEvent)
  .delete(eventController.deleteEvent);

router.use("/:eventId/seats", seatRouter);

module.exports = router;
