const Validator = require("validator");
const isEmpty = require("./is-Empty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.profession = !isEmpty(data.profession) ? data.profession : "";
  data.contact_number = !isEmpty(data.contact_number)
    ? data.contact_number
    : "";
  data.dob = !isEmpty(data.dob) ? data.dob : "";

  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "Username need to be at least 2 characters.";
  }

  if (Validator.isEmpty(data.handle)) {
    errors.handle = "Username field is required.";
  }

  if (Validator.isEmpty(data.profession)) {
    errors.profession = "Profession field is required.";
  }

  if (Validator.isEmpty(data.contact_number)) {
    errors.contact_number = "Contact Number is required.";
  }

  if (!Validator.isMobilePhone(data.contact_number, ["en-IN"])) {
    errors.contact_number = "Invalid Contact Number";
  }

  if (Validator.isEmpty(data.dob)) {
    errors.dob = "Date of Birth is required";
  }

  if (Validator.toDate(data.dob).isEmpty(data.dob)) {
    errors.dob = "Invalid Date of Birth";
  }

  if (!isEmpty(data.social.facebook)) {
    if (!Validator.isURL(data.social.facebook)) {
      errors.social.facebook = "Not a valid URL";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
