const jwt = require("jsonwebtoken");

exports.generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      admin: user.admin,
    },
    process.env.JWT_ACCESS_KEY,
    {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    }
  );
};

exports.generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      admin: user.admin,
    },
    process.env.JWT_REFRESH_KEY,
    {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    }
  );
};
