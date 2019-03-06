const express = require("express");
const db = require("../models");
const router = express.Router();

// GET /users
router.get("/", (req, res) => {
  db.category.findAll().then(categories => {
    res.render("categories/index", { categories });
  });
});

router.get("/:id", (req, res) => {
  db.category
    .find({
      where: { id: req.params.id }
    })
    .then(category => {
      category.getPoems().then(poems => {
        res.render("categories/show", { category, poems });
      });
    });
});

module.exports = router;
