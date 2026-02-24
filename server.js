const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const employeeUtil = require("./modules/player-util");

const app = express();

// Set up EJS
app.set("view engine", "ejs");
app.set("layout", "layouts/main");
app.use(expressLayouts);

app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    res.render("home", {
        players: playerUtil.getAllPlayers(),
        title: "Player List" 
    });
});

//
app.get('/visible', (req, res) => {
    res.render("home", {
        employees: playerUtil.getVisibleEmployees(playerUtil.getAllEmployees()),
        title: "Active Players Only"
    });
});

app.get('/about', (req, res) => {
    res.render("about", {
        title: "About"
    });
});

const HTTP_PORT = process.env.PORT || 8080;

app.listen(HTTP_PORT, () => {
    console.log(`server listening on: ${HTTP_PORT}`);
});


