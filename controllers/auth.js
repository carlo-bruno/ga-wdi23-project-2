var express = require("express");
var router = express.Router();
var db = require("../models");
const passport = require("../config/passportConfig");

router.get("/signup", function (req, res) {
  res.render("auth/signup");
});

router.post("/signup", function (req, res) {
  db.user
    .findOrCreate({
      where: { email: req.body.email },
      defaults: {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
      }
    })
    .spread(function (user, created) {
      if (created) {
        console.log("User created");
        passport.authenticate("local", {
          successRedirect: "/",
          successFlash: "Account created and logged in"
        })(req, res);
      } else {
        console.log("Email already exists");
        req.flash("error", "Email already exists.");
        res.redirect("/auth/signup");
      }
    })
    .catch(function (error) {
      req.flash("error", "Error occurred. Please try again.")
      res.redirect("/auth/signup");
    });
});


router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    successFlash: "You have logged in!",
    failureRedirect: "/welcome",
    failureFlash: "Invalid username/password"
  })
);

router.get("/logout", function (req, res) {
  req.logout();
  req.flash("success", "You have logged out!");
  res.redirect("/welcome");
});

module.exports = router;
