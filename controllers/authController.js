const User = require("../models/User");
const bcrypt = require("bcrypt");

//: REGISTER
exports.register = async (req, res, next) => {
  try {
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
  } catch (error) {
    res.status(500).json(error);
  }
};

//: LOGIN
exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) res.status(404).json("Wrong username!");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) res.status(404).json("Wrong password!");

    if (user && validPassword) {
      res.status(200).json({
        status: "success",
        data: user,
      });
    }
  } catch (error) {}
};
