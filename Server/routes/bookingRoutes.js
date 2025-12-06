const express = require("express");
const seatController = require("../controllers/seatController");
const authController = require("../middlewares/auth");

const router = express.Router();

router.use(authController.protect);

router.get("/me", seatController.getMyBookings);

module.exports = router;
