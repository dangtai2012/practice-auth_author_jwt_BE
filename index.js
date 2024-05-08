const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// ROUTE HANDLERS
const authRouter = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// ROUTES
app.use("/api/v1", authRouter);

module.exports = app;
