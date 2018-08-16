const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  handle: {
    type: String,
    required: true,
    max: 40
  },
  profession: {
    type: String,
    required: true
  },
  institution: {
    type: String
  },
  contact_address: {
    type: String
  },
  contact_number: {
    type: String,
    required: true
  },
  standard: {
    type: String
  },
  performance: [
    {
      test_id: {
        type: Schema.Types.ObjectId,
        ref: "tests"
      }
    }
  ],
  questions: [
    {
      question_id: {
        type: Schema.Types.ObjectId,
        ref: "questions"
      }
    }
  ],
  dob: {
    type: Date,
    required: true
  },
  social: {
    google: {
      type: String
    },
    facebook: {
      type: String
    }
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
