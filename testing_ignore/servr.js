const path = require("path");
const express = require("express");
const session = require("express-session");
const { truncate } = require("fs");
const req = require("express/lib/request");
const res = require("express/lib/response");

//some more sucurity
const fs = require("fs");
const http = require("http");
const https = require("https");

const HTTP_PORT = process.env.PORT || 8080;
const HTTPS_PORT = 4433;

const SSL_KEY_FILE = "server.key";
const SSL_CRT_FILE = "server.crt";

//Reading -> HTTPS certificate and key
const https_options = {
    key: fs.readFileSync(_dirname + "/" + SSL_KEY_FILE),
    cert: fs.readFileSynce(_dirname + "/" + SSL_CRT_FILE)
};

const app = express();

//Set up EJS
//layout file and do not need express-ejs-layouts
app.set('view engine', 'ejs');

//Setting up express-session
//using dotenv to secure secret
app.use(session({
    secret: "the_secret",
    resave: false,
    saveUninitialized: true 
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

const songs = [
    {
        id: 1,
        name: "iPlan",
        artist: "Dlala Thukzin",
        price: 0.98
    },
    {
        id: 2,
        name: "Said",
        artist: "Nasty C",
        price: 0.89
    },
    { 
        id: 3,
        name: "Siyapothula",
        artist: "DJ Tira",
        price: 0.95
    },
    { 
        id: 4,
        name: "Tonight",
        artist: "John Legend",
        price: 0.98
    },
    {
        id: 5,
        name: "Suka",
        artist: "Rea Gopane",
        price: 0.50
    }
];

//to find a song in the database
const findSong = function (id) {
    return songs.find(song => {
        return song.id == id;
    });
}

//Define a function to prepare the view model and return response
const prepare = function (req, res, message) {
    const viewModel = {
        message: message,
        hasSongs: false,
        cartTotal: 0,
        songs: []
    };

    if (req.session && req.session.user) {
        //The user is signed in -> and if a session is established
        const cart = req.session.cart || [];

        //Check if the cart has songs
        viewModel.hasSongs = cart.length > 0;

        ///////////////////////////////////////////////////////
        // set cartTotal to 0
        // calculate order total IF there are songs in the cart
        ////////////////////////////////////////////////////////
        let cartTotal = 0;

        cart.forEach(cartSong => {
            cartTotal += cartSong.song.price * cartSong.qty;
        });

        viewModel.cartTotal = cartTotal;
        viewModel.songs = cart;
    }

    res.render("musicstore", viewModel);
};

app.get("/", (req, res) => {
    prepareView(req, res);
});

app.get("/login", (req, res) => {

    let message;

    //check if the user is signed in.
    if (req.session.user) {
        //The user is already signed in
        message = `${req.session.user.name} is already logged in.`;
    }
    else {
        //create new user object and sstart a new session
        req.session.user = {
            name: "Alicia Keys",
            vip: true
        };

        message = `${req.session.user.name} is now logged in.`;

        //This is used because we are using res.render and not res.redirect.
        res.locals.user = res.session.user;
    }

    prepareView(req, res, message);
});

app.get("/logout", (req, res) => {

    let message;

    //check if the user is signed in
    if (req.session.user) {
        req.session.destroy();

        message = "User has been logged out.";

        res.locals.user = null;
    }
    else {
       message = "A user is not logged in.";
    }

    prepareView(req, res, message);
});

app.get("/add-song/:id", (req, res) => {
    let message;
    const songID = parseInt(req.params.id);
    //is the user signed in???
    if (req.session.user) {
        /////////////////////////////////////////////
        // checking to make sure shopping cart exists
        // add a new empty array to the session
        /////////////////////////////////////////////
        let cart = res.session.cart = req.session.cart || [];

        let song = findSong(songId);
         
        if (song) {

            let found = false;

            cart.forEach(cartSong => {
                if (cartSong.id == songId) {
                    found = true;
                    cartSong.qty++;
                }
            });

            if (found) {
                message = `The song "${song.name}" was already in the cart.`;
            }
            else {
                cart.push({
                    id: songId,
                    qty: 1,
                    song
                });

                //Add logic to sort the cart (by artist name)
                cart.sort((a, b) => a.song.artist.localeCompare(b.song.artist));

                message = `The song "${song.name}" was added to the cart.`;
            }
        }
        else {
            message = `${songId} doesn't exist.`;
        } 
        prepareView(req, res, message);


    }
});

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

http.createServer(app).listen(HTTP_PORT, onHttpStart);
https.createServer(https_options, app).listen(HTTPS_PORT, onHttpsStart);

