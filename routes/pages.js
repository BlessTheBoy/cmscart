const express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  res.status(200).render("index", {
    title: "Home",
  });
});

module.exports = router;
