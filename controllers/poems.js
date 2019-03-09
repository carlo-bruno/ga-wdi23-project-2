const express = require("express");
const async = require("async");
const db = require("../models");
const router = express.Router();

// POST /poems - create new poem
router.post("/", (req, res) => {
  db.poem
    .create({
      title: req.body.title,
      content: req.body.content,
      userId: req.body.userId,
      isPublished: req.body.isPublished ? true : false,
      hearts: 0
    })
    .then(poem => {
      let catArr = req.body.category
        .toLowerCase()
        .replace(/\,\s/g, ",")
        .split(",");

      let createCallBacks = catArr.map(cat => {
        return function(cb) {
          db.category
            .findOrCreate({
              where: { name: cat }
            })
            .spread((category, created) => {
              poem.addCategory(category);
              cb();
            });
        };
      });

      async.parallel(
        async.reflectAll(createCallBacks),
        (error, results) => {
          console.log("created categories");
          res.redirect(`/poems/${poem.id}`);
        }
      );
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

// GET /poems/1/edit - edit page
router.get("/:id/edit", (req, res) => {
  let id = parseInt(req.params.id);
  db.poem.findById(id).then(poem => {
    poem.getCategories().then(categories => {
      res.render("poems/edit", { poem, categories });
    });
  });
});

// GET /poems/1 - one poem
router.get("/:id", (req, res) => {
  let id = parseInt(req.params.id);
  db.poem
    .findOne({
      where: { id },
      include: [db.user]
    })
    .then(poem => {
      poem.getCategories().then(categories => {
        db.comment
          .findAll({
            where: { poemId: poem.id },
            include: [db.user]
          })
          .then(comments => {
            res.render("poems/show", {
              poem,
              categories,
              comments
            });
          });
      });
    })
    .catch(error => {
      req.flash("error", "Poem not found");
      res.redirect("/poems");
    });
});

// PUT /poems/1 - edit poem
router.put("/:id", (req, res) => {
  let id = parseInt(req.params.id);
  db.poem
    .update(
      {
        title: req.body.title,
        content: req.body.content,
        isPublished: req.body.isPublished ? true : false
      },
      {
        where: { id }
      }
    )
    .then(() => {
      db.poem.findByPk(id).then(poem => {
        let catArr = req.body.category
          .toLowerCase()
          .replace(/\,\s/g, ",")
          .split(",");

        let createCallBacks = catArr.map(cat => {
          return function(cb) {
            db.category
              .findOrCreate({
                where: { name: cat }
              })
              .spread((category, created) => {
                poem.addCategory(category);
                cb();
              });
          };
        });

        async.parallel(
          async.reflectAll(createCallBacks),
          (error, results) => {
            console.log("created categories");
            res.redirect(`/poems/${id}`);
          }
        );
      });
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
      db.categoriesPoems
        .destroy({
          where: { poemId: id }
        })
        .then(() => {
          res.redirect("/users");
        });
    });
});

module.exports = router;
