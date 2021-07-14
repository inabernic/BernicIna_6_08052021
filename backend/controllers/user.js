const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**  Functions for user signup **/
exports.signup = (req, res) => {
  if (!(req.body.password.match( /[0-9]/g) && 
      req.body.password.match( /[A-Z]/g) && 
      req.body.password.match(/[a-z]/g) && 
      req.body.password.match( /[^a-zA-Z\d]/g) &&
      req.body.password.length >= 8)){
        return res.status(400).json({
          message: "Mot de passe doit contenir au moins 1 chiffre,au moins 1 majuscule,au moins 1 minuscule, ,au moins 1 caractère spécial,minimum 8 caractères.",
        });
  } else if (!(req.body.email.match( /^(([^<>()[]\.,;:s@]+(.[^<>()[]\.,;:s@]+)*)|(.+))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/))){
    return res.status(400).json({
      message: "L'email n'est pas conforme.",
    });
  } else {
    bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
        const user = new User({
          email: req.body.email, 
          password: hash,
        });
        user.save()
          .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
          .catch((error) => res.status(400).json({ error }));
      })
    .catch((error) => res.status(500).json({ error })); 
  };
}


/**  Functions for user login **/
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
