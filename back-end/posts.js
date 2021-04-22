const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();


const users = require("./users.js");
const User = users.model;
const validUser = users.valid;




const postSchema = new mongoose.Schema({
  userID: String,
  personID: String,
  title: String,
  contents: String,
  time: String
});

const Post = mongoose.model('Post', postSchema);




router.post("/", validUser, async(req, res) => {
  console.log("post called");
  try {
  const post = new Post({
    userID: req.user._id,
    personID: req.body.personID,
    title: req.body.title,
    contents: req.body.contents,
    time: req.body.time
  });

    await post.save();
    console.log("Post saved!");
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }

});

router.get("/:id", validUser, async(req, res) => {

  try {
    let posts = await Post.find({
      personID: req.params.id,
    }).sort({
      created: -1
    });
    console.log(req.body)
    console.log(req.body.personID);
    console.log(posts);
    return res.send(posts);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }

} );


router.put("/:id", validUser, async(req, res) => {
  try{
    let post = await Post.findOne({
      _id: req.params.id
    });

    post.title = req.body.title;
    post.contents = req.body.description;
    post.time = req.body.time;
    await post.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.delete("/:id", validUser, async(req, res) => {
  try{
    await Post.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});



module.exports = {
  model: Post,
  routes: router,
}
