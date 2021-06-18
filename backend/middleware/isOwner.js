const Sauce = require("../models/Sauce");

module.exports = (req, res, next) => {
  console.log("auth");
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    console.log(sauce);

    next();
  });
};
