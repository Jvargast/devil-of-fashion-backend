const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors')
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDatabase = require("./src/config/database");
const errorMiddleware = require("./src/middleware/error");

dotenv.config();

//connecting data base

connectDatabase();

/* const mongoose = require("mongoose");
const connect = mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err)); */

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());


//Route Imports
const product = require("./src/routes/productRoutes");
const user = require("./src/routes/userRoutes");
const order = require("./src/routes/orderRoutes");


app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);

//Middleare for error
app.use(errorMiddleware);


//Handling Uncaught exception
process.on("uncaughtException", (error)=> {
  console.log(`Error ${error.message}`);
  console.log("shutting down the server due to uncaught Exception");
  process.exit(1);
})

const port = process.env.PORT || 6000;
const server = app.listen(port, () => {
  console.log(`Server Running at port ${port}`)
});

//Unhandled promise rejection
process.on("unhandledRejection", err=> {
  console.log(`Error ${err.message}`);
  console.log("shutting down the server due to unhandled promise rejection");
  server.close(()=> {
    process.exit(1);
  })
})

