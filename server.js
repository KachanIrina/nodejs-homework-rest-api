require("dotenv").config();

const app = require("./app");

const mongoose = require("mongoose");

const url = process.env.DB_URL;

mongoose.set("strictQuery", true);

mongoose
  .connect(url)
  .then(() =>
    app.listen(3000, () => {
      console.log("Database connection successful");
    })
  )
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
