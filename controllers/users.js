const express = require("express");
const isLoggedIn = require('../middleware/isLoggedIn')
const db = require("../models");
const router = express.Router();

// GET /users - current user's profile
// show all poems by currentUser
router.get("/dashboard", isLoggedIn, (req, res) => {
  let id = parseInt(req.user.id);
  db.poem
    .findAll({
      where: { userId: id },
      include: [db.user]
    })
    .then(poems => {
      res.render("users/dashboard", { poems });
    });
});

// GET /users/1 - other user's profile
// only show published poems by author
router.get("/:id", (req, res) => {
  let id = parseInt(req.params.id);

  db.user
    .find({
      where: { id },
    })
    .then(user => {
      user.getPoems({
        where: { isPublished: true }
      }).then(poems => {
        res.render("users/show", { user, poems });
      })
    });
});

module.exports = router;
