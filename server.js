
const path = require("path");
const express = require('express');
const app = express(); 


app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, "views", "about.html"));
});


app.use((req, res) => {
    res.status(404).send("Page Not Found");
});


app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send("Something is Off!")
});


const HTTP_PORT = process.env.PORT || 8080;


function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}


app.listen(HTTP_PORT, onHttpStart);