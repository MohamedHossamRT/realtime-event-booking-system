const AuthService = require("../services/authService");
const catchAsync = require("../utils/catchAsync");

exports.signup = catchAsync(async (req, res, next) => {
  const { user, token } = await AuthService.signup(req.body);

  res.status(201).json({
    status: "success",
    token,
    data: { user },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { user, token } = await AuthService.login(
    req.body.email,
    req.body.password
  );

  res.status(200).json({
    status: "success",
    token,
    data: { user },
  });
});
