const express = require("express");
const db = require("../models");
const router = express.Router();

router.post("/", (req, res) => {
  let id = req.body.poemId;
  db.poem.findByPk(id).then(poem => {
    poem
      .createComment({
        userId: req.user.id,
        content: req.body.content
      })
      .then(() => {
        res.redirect(`/poems/${id}`);
      });
  });
});

module.exports = router;
