const express = require("express");
const db = require("../models");
const router = express.Router();

// GET /users - current user's profile
// show all poems by currentUser
router.get("/", (req, res) => {
  let id = parseInt(req.user.id);
  db.poem
    .findAll({
      where: { userId: id },
      include: [db.user]
    })
    .then(poems => {
      res.render("users/profile", { poems });
    });
});

// GET /users/1 - other user's profile
// only show published poems by author
router.get("/:id", (req, res) => {
  let id = parseInt(req.params.id);
  // if same as logged in user, redirect to own profile
  if (req.user && id === req.user.id) {
    res.redirect("/users");
  }

  db.poem
    .findAll({
      where: { userId: id, isPublished: true },
      include: [db.user]
    })
    .then(poems => {
      res.render("users/show", { poems });
    });
});

module.exports = router;
