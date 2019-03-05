const express = require("express");
const db = require("../models");
const router = express.Router();

// POST /poems - create new poem
router.post("/", (req, res) => {
  db.poem
    .create(
      {
        title: req.body.title,
        content: req.body.content,
        userId: req.body.user
      },
      {
        defaults: {
          isPublished: false,
          hearts: 0
        }
      }
    )
    .then(() => {
      res.redirect("/");
    });
});

// GET /poems - index
router.get("/", (req, res) => {
  db.poem
    .findAll({
      where: { isPublished: true },
      include: [db.user]
    })
    .then(poems => {
      res.render("main/index", { poems });
    });
});

// GET /poems/new - writer page
router.get("/new", (req, res) => {
  res.render("poems/new");
});

// GET /poems/edit/1 - edit page
router.get("/:id/edit", (req, res) => {
  let id = parseInt(req.params.id);
  db.poem.findById(id).then(poem => {
    res.render("poems/edit", { poem });
  });
});

// GET /poems/1 - one poem
router.get("/:id", (req, res) => {
  let id = parseInt(req.params.id);
  db.poem
    .findOne({
      where: { id },
      include: [db.user, db.comment]
    })
    .then(poem => {
      poem.getCategories().then(categories => {
        res.render("poems/show", { poem, categories });
      });
    });
});

// PUT /poems/1 - edit poem
router.put("/:id", (req, res) => {
  let id = parseInt(req.params.id);
  db.poem
    .update(
      {
        title: req.body.title,
        content: req.body.content
      },
      {
        where: { id }
      }
    )
    .then(() => {
      res.redirect(`/poems/${id}`);
    });
});

// DELETE /poems/1 - delete poem
router.delete("/:id", (req, res) => {
  let id = parseInt(req.params.id);
  db.poem
    .destroy({
      where: { id }
    })
    .then(() => {
      res.redirect("/poems");
    });
});

module.exports = router;
