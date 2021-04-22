const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

const users = require("./users.js");
const User = users.model;
const validUser = users.valid;

const personSchema = new mongoose.Schema({
  userID: String,
  name: String,
  birthdate: String,
  description: String,
  friends: [String]
});

const Person = mongoose.model('Person', personSchema);


router.post("/", validUser, async (req, res) => {
  try {
    let person = new Person({
      userID: req.user._id,
      name: req.body.name,
      birthdate: req.body.birthdate,
      description: req.body.description,
      friends: [],
    });

    await person.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.get("/user", validUser, async(req, res)=> {
  try {
    let person = await Person.findOne({
      userID: req.user._id
    });
    return res.send(person);

  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
})

router.get("/:id", validUser, async(req, res) => {
  console.log("looking for id");
  try {
    console.log("id is " + req.params.id);
    let person = await Person.findOne({
      _id: req.params.id
    });
    console.log("results are: " + person);

    return res.send(person);

  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }

});

router.get("/name/:name", validUser, async(req, res) => {
  console.log("calling name!!!");
  console.log("looking for " + req.params.name);
  try {
    let person = await Person.find({
      name: req.params.name
    });
    console.log("found: " + person);
    return res.send(person);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});


router.put("/:id", validUser, async(req, res) => {
try {
  console.log("personID is " + req.params.id);
  let person = await Person.findOne({
    _id: req.params.id
  });

  console.log("person found!");

  person.name = req.body.name;
  person.birthdate = req.body.birthdate;
  person.description = req.body.description;
  person.friends = req.body.friends;
  await person.save();
  return res.sendStatus(200);

} catch (error) {
  console.log(error);
  return res.sendStatus(500);
}

});


module.exports = {
  model: Person,
  routes: router,
}
