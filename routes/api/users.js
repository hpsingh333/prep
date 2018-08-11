const express = require("express");

const router = express.Router();

const User = require("../../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const keys = require("../../config/keys");

router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

router.post("/register", (req, res) => {
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (user) {
      return res.status(400).json({
        email: "Email already exists"
      });
    } else {
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   POST api/user/login
// @desc    Login User // Returning JWT TOKEN
// @access  PUBLIC

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //find user by email
  User.findOne({ email }).then(user => {
    // check for user
    if (!user) {
      return res.status(404).json({ email: "User not found" });
    }
    // check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //user successfully logged in
        const payload = { id: user.id, name: user.username };
        // sign token
        jwt.sign(payload, keys.loginKey, { expiresIn: "30d" }, (err, token) => {
          if (!err) {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        });
      } else {
        return res
          .status(400)
          .json({ password: "Email and Password do not match" });
      }
    });
  });
});

module.exports = router;
