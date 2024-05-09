const User = require("../models/User");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

//: GET ALL USERS
exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find();
  return res.status(200).json({
    status: "success",
    data: users,
  });
});

//: DELETE USER
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return new AppError("User not found!", 404);

  res.status(200).json("Delete successfully");
});
