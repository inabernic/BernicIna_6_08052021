const Sauce = require("../models/Sauce");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  const userId = decodedToken.userId;
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    if (userId === sauce.userId) {
      next();
    } else {
      res.status(403).json({
        error: new Error("Invalid request!"),
      });
    }
  });
};
