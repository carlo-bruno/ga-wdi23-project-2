const express = require("express");
const db = require("../models");
const router = express.Router();

// GET /users
router.get("/", (req, res) => {
  db.poem
    .findAll({
      where: { userId: req.user.id },
      include: [db.user]
    })
    .then(poems => {
      res.render("users/show", { poems });
    });
});

module.exports = router;
