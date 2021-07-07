const express = require("express");
var router = express.Router();
const { check, body, validationResult } = require("express-validator");

// get page model
var Page = require("../models/page");

// GET pages index
router.get("/", (req, res) => {
  res.status(200).send("Admin Area");
});

// GET add pages
router.get("/add-page", (req, res) => {
  var title = "";
  var slug = "";
  var content = "";

  res.render("admin/add_page", {
    title,
    slug,
    content,
  });
});

const addPagePostChecker = (req, res, next) => {
  console.log(req.body);
  check(req.body.title, "Title must have a value.").notEmpty();
  check("content", "Content must have a value.").notEmpty();
  next();
};

// POST add pages
router.post(
  "/add-page",
  [
    check("title", "Title must have a value.").notEmpty(),
    check("content", "Content must have a value.").notEmpty(),
  ],
  (req, res) => {
    var title = req.body.title;
    var content = req.body.content;
    var slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
    if (slug == "") slug = title.replace(/\s+/g, "-").toLowerCase();

    const errors = validationResult(req).array();

    console.log(errors);
    if (errors.length > 0) {
      res.render("admin/add_page", {
        errors,
        title,
        slug,
        content,
      });
    } else {
      console.log(Page.findOne({ slug: slug }));
      Page.findOne({ slug: slug }, function (err, page) {
        if (page) {
          req.flash("danger", "Page slug exists, choose another.");
          res.render("admin/add_page", {
            title,
            slug,
            content,
          });
          console.log("Page duplication");
        } else {
          var page = new Page({
            title: title,
            slug: slug,
            content: content,
            sorting: 0,
          });
          page.save(function (err) {
            if (err) return console.log(err);
            req.flash("success", "Page added!");
            console.log("Page added");
            res.redirect("/admin/pages");
          });
        }
      });
    }
  }
);

module.exports = router;
