const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors')
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const userRoutes = require("./src/routes/user")

dotenv.config();

const mongoose = require("mongoose");
const connect = mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);


const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server Running at ${port}`)
});