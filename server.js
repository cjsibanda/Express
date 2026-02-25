const express = require("express");
const app = express();
const mongoose = require('mongoose');

const HTTP_PORT = process.env.PORT || 8080;
const DB = `Full MongoDB Connection String Here`;

app.set("view engine", "ejs");

let Schema = mongoose.Schema;

const nameSchema = new Schema({
  fName: String,
  lName: String
});

let Name = mongoose.model('names', nameSchema);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {

  Name.find().sort({createdAt: 1}).exec().then((data) => {
      res.render("home", { data });
  }).catch(err=>{
    console.log(err);
  });

});

app.post("/updateName", (req, res) => {
    if (req.body.lName.length == 0 && req.body.fName.length == 0) {

        Name.deleteOne({_id: req.body._id}).exec().then(() => {
            console.log("successfully removed name: " + req.body._id);
            res.redirect("/"); 
        });

    } else {

      Name.updateOne({_id: req.body._id}, {
        $set: {
          lName: req.body.lName,
          fName: req.body.fName
        }
      }).exec().then(() => {
          console.log("successfully updated name: " + req.body._id);
          res.redirect("/");
      });

    }
});

app.post("/addName", (req, res) => {

  const newName = new Name({
    lName: req.body.lName,
    fName: req.body.fName
  });

  newName.save().then(() => {
      console.log(" created a new name");
      res.redirect("/");
  });
});

mongoose.connect(DB).then(()=>{
  app.listen(HTTP_PORT, ()=>{
    console.log(`server listening on: ${HTTP_PORT}`);
  });
}).catch(err=>{
  console.log(err);
})