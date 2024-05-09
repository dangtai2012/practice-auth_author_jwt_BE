const User = require("../models/User");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const tokenService = require("../utils/tokenService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

let refreshTokens = [];

//: REGISTER
exports.register = catchAsync(async (req, res, next) => {
  // Hashed password
  const salt = await bcrypt.genSalt(12);
  const hashed = await bcrypt.hash(req.body.password, salt);

  // Create new user
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashed,
  });

  // Save to DB
  const user = await newUser.save();

  res.status(200).json({
    status: "success",
    data: user,
  });
});

//: LOGIN
exports.login = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).lean();

  if (!user) return next(new AppError("Wrong email!", 400));

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) return next(new AppError("Wrong password!", 400));

  if (user && validPassword) {
    const accessToken = tokenService.generateAccessToken(user);
    const refreshToken = tokenService.generateRefreshToken(user);

    refreshTokens.push(refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    delete user.password;
    user.accessToken = accessToken;

    return res.status(200).json({
      status: "success",
      data: user,
    });
  }
});

exports.verify = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return next(new AppError("You're not authenticated", 401));

  jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
    if (err) return next(new AppError("Token is not valid", 403));
    req.user = user;
    next();
  });
};

exports.restrictTo = (req, res, next) => {
  if (req.user.id === req.params.id || req.user.admin) {
    next();
  } else {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }
};

exports.refreshToken = catchAsync(async (req, res, next) => {
  // Take refreshToken from user
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return new AppError("You're not authenticated!", 401);

  if (!refreshTokens.includes(refreshToken))
    return new AppError("Refresh token is not valid", 403);

  jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
    if (err) {
      console.log(err);
    }

    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    // Create new accessToken, refreshToken
    const newAccessToken = tokenService.generateAccessToken(user);
    const newRefreshToken = tokenService.generateRefreshToken(user);

    refreshTokens.push(newRefreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    res.status(200).json({
      accessToken: newAccessToken,
    });
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  res.clearCookie("refreshToken");
  refreshTokens = refreshTokens.filter(
    (token) => token !== req.cookies.refreshToken
  );
  res.status(200).json("Logged out!");
});
