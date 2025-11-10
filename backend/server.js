// server.js

//Import the express library to build our server
require("dotenv").config(); //Load environment variables from .env 
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const express = require("express");
const connectDB = require("./config/db");
// const clientRoutes = require("./routes/client");

//Create an instance of express
const app = express();
const authRoutes = require("./routes/auth");
app.use(helmet()); //security 
app.use(cors({
    origin: "http://localhost:5173", //frontend origin 
    credentials: true
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true}));

connectDB(); //Connect to the database

//Middleware to parse JSON request bodies(important for APIs)
app.use(express.json());

//mount auth routes
//all auth related routes will be prefixed with /api/auth
app.use("/api/auth", authRoutes);
// app.use("/api", clientRoutes);



//Default route to test server
app.get("/", (req, res) => {
    res.send("The server is up and running");
})

//Start the server on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})