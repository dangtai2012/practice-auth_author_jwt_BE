const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const app = require("./index");

const mongodb_connection_string = process.env.MONGODB_URL.replace(
  "<PASSWORD>",
  process.env.MONGODB_PASSWORD
);

mongoose.connect(mongodb_connection_string).then(() => {
  console.log(">>> MONGODB connection successful");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`>>> Server is running on port ${port}`);
});
