const express = require("express");
const router = express.Router();

//Route to default page (home page)
router.get("/", (req, res) => {
    res.render("general/home")
});

//Route to the about page
router.get("/about", (req, res) => {
    res.render("general/home")
});

//Route to the about page.
router.get("/about", (req, res) => {
    res.render("general/about")
});

module.exports = router;