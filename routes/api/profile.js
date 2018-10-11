const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load Validation
const validateProfileInput = require("../../validation/profile");

// Load Profile Model
const Profile = require("../../models/Profile");
// Load User Model
const User = require("../../models/User");

// @route   GET api/profile
// @desc    gets current user profile
// @access  Private

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   POST api/profile
// @desc    create user profile
// @access  Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    // Check Validation
    if (!isValid) {
      //Return errors with status 400
      return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.profession) profileFields.profession = req.body.profession;
    if (req.body.institution) profileFields.institution = req.body.institution;
    if (req.body.contact_address)
      profileFields.contact_address = req.body.contact_address;
    if (req.body.contact_number)
      profileFields.contact_number = req.body.contact_number;
    if (req.body.standard) profileFields.standard = req.body.standard;
    if (req.body.dob) profileFields.dob = req.body.dob;
    // Social
    profileFields.social = {};
    if (req.body.social.google)
      profileFields.social.google = req.body.social.google;
    if (req.body.social.facebook)
      profileFields.social.facebook = req.body.social.facebook;

    Profile.findOne({ user: profileFields.user.id }).then(profile => {
      if (profile) {
        // Update profile
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        //Create profile

        // Check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }
        });
        // Save profile
        new Profile(profileFields).save().then(profile => res.json(profile));
      }
    });
  }
);

router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

module.exports = router;
