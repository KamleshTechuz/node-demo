const express = require("express");

const { check, body } = require("express-validator/check");
const authController = require("../controllers/auth");

const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail(),
    body("password", "Password has to be valid.")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid E-mail.")
      .custom((value, { req }) => {
        console.log("value :>> ", value);
        return User.findOne({ email: value }).then((userDoc) => {
          console.log("userDoc :>> ", userDoc);
          if (userDoc) {
            return Promise.reject("This E-mail already exists");
          }
        });
      })
      .normalizeEmail(),
    body("password", "Follow the password policy").isLength({ min: 5 }).trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error(`Passwords don't match`);
        }
        return true;
      }),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
