const express = require("express");
const authController = require("../controllers/authController");
const { loginLimiter } = require("../middlewares/rateLimiter");
const validate = require("../middlewares/validate");
const { signupSchema, loginSchema } = require("../validations/authValidation");

const router = express.Router();

router.post("/signup", validate(signupSchema), authController.signup);
router.post(
  "/login",
  loginLimiter,
  validate(loginSchema),
  authController.login
);

module.exports = router;
