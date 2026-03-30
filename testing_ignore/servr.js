const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const http = require("http");
const https = require("https");

//const HTTP_PORT = process.env.HTTP_PORTPORT || 8080;
const HTTP_PORT_PORT = 4433;

const SSL_KEY_FILE = "server.key";
const SSL_CRT_FILE = "server.crt";

// Read in the contents of the HTTPs certificate and key
const https_options = {
    key: fs.readFileSync(_dirname + "/" + SSL_KEY_FILE),
    cart: fs.readFileSync(_dirname + "/" + SSL_CRT_FILE)
};



//Set up express.
const app = express();

//Set up Mongoose Schema
const nameSchema = new mongoose.Schema({
    nickname: {
        type: String,
        unique: true
    },
    fName: String,
    lName: String,
    age: {
        type: Number,
        default: 25
    }
});

//setting up mongoose model
const nameModel = mongoose.model("names", nameSchema);

const namesToAdd = [
  {nickname: "Bron", fName: "LeBron", lName: "James", age: 40},
  {nickname: "KD", fName: "Kevin", lName: "Durant", age: 33}, 
  {nickname: "Ant", fName: "Anthony", lName: "Edwards", age: 27}
];

/////////////////////////////////////////////////
// to a a route to copy the database to MongoDB
// "load-data" should be the prefix
//  route url is the entity name
//////////////////////////////////////////////////
add.get("/load-data/names", (req, res) => {
    nameModel.countDocuments()
      .then(count => {
        if (count === 0) {
          nameModel.insertMany(namesToAdd)
            .then(() => {
                res.send("It worked!! -- Data loaded");
            })
            .catch(err => {
                res.send("Error: " + err);
            });
        }    
        else {
            res.send(">>--Loaded--<<")
        }
      })
      .catch(err => {
        res.send("Error: " + err);
      });

});

app.get("/", (req, res) => {
    res.send("Good to go...");
})

//////////////////////////////////////
// handling 404 requests
// for pages that are not found
//////////////////////////////////////
app.use((req, res) => {
    res.status(404).send("Page Does Not Exist :(");
});

//catch errors
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send("It's Broken!")
});

//defines a port to listen on...
const HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

//connect to the MongoDB
mongoose.connect("connection_string").then(() => {
    console.log("Connected to the database");
    app.listen(HTTP_PORT, onHttpStart);
});


