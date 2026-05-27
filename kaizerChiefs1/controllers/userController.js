const express = require("express");
const bcrypt = require("bcryptjs");
const path = require("path");

const userModel = require("../models/userModel");

//Route to registration page
router.get("/register", (req, res) => {
    res.render("users/register")
});

router.post("/register", (req, res) => {
    const {firstName, lastName, email, password} = req.body;

    const newUser = new userModel({
        firstName, lastName, email, password
    });

    newUser.save()
       .then(user => {
        console.log(`User ${user.firstName} added to collection `);

        const profilePicFile = req.files.profilePic;
        const profilePicName = path.parse(profilePicFile.name);
        const uniqueName = `profile-pic-${user._id}${profilePicName.ext}`;

        //copy the image to a file on the file system
        profilePicFile.mv(`public/profile-pics/${uniqueName}`)
           .then(() => {
              userModel.updateOne({
                _id: user._id
              }, {
                profilePic: uniqueName
              })
                .then(() => {
                    console.log("updated the user document.");
                    res.redirect("/");
                })
                .catch(err => {
                    console.log("couldn't update the user document. " + err);
                    res.redirect("/");
                });
           })
           .catch(err => {
            console.log("Couldn't upload the image. " + err);
            res.redirect("/");
           })
       })
       .catch(err => {
        console.log(`Error adding user to the colection... ${err}`);
        res.render("users/register");
       });
});

//Set up login routes
router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post("/login", (req, res) => {
    res.render("users/login");
});

router.post("/login", (req, res) => {
    const {email, password} = req.body;

    //need to validate that both email and password provided
    let errors = [];

    userModel.findOne({
        email
    })
       .then(user => {
        //Search completed
        if (user) {
            bcryptjs.compare(password, user.password)
              .then(matched => {
                if (matched) {
                    req.session.user = user;

                    console.log("User signed in.");
                    res.redirect("/");
                }
                else {
                    console.log("Password didn't match");
                    errors.push("email or password was wrong");
                    res.render("users/login", {
                        errors
                    });
                }
              })
              .catch(err => {
                        errors.push("There was a problem");

                        console.log("Unable to compare passwords: " + err);

                        res.render("users/login", {
                            errors
                        });
                    });
            }
            else {
                // user document was not found.
                errors.push("Email and password combination not found.");
                console.log(errors[0]);
                res.render("users/login", {
                    errors
                });
            }
        })
        .catch(err => {
            // Not able to query the database.
            errors.push("There was a problem");

            console.log("Unable to query the database: " + err);

            res.render("users/login", {
                errors
            });
        });
});

router.get("/logout", (req, res) => {
    // Clear the session from memory.
    req.session.destroy();

    // DO NOT DO THIS!
    //req.session.user = null;

    res.redirect("/users/login");
});

module.exports = router;

        