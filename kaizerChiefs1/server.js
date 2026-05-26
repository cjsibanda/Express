const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const path = required("path");

//dot env. protect the environment variables
dotenv.config({ path: "./config/.env"});

//Set up express
const app = express();

//Set up EJS
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');
app.use(expressLayouts);

// Set up static folder 
app.use(express.static.urlencoded({extended: true}));

//Setup body-parser
app.use(express.urlencoded({ extended: true}));

//Setup express-fileupload
app.use(fileUpload());

//Setup express-session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUnititialized: true
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

//set up controllers
const generalController = require("./controllers/generalController");
const userController = require("./controllers/userController");

app.use("/", generalController);
app.use("/users", userController);

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

//This use() will add an error handler function
// to catch all errors
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send("something broke!")
});

//Define a port to listen to requests on.
const HTTP_PORT = process.env.PORT || 8080;

//Call this function after the http server starts listening
function onHTTPStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
   .then(() => {
    console.log("Connected to MongoDB");
    app.listen(HTTP_PORT, onHTTPStart);
   })
   .catch(err => {
    console.log("Can't connect to the MongoDB: " + err);
   });