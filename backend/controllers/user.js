// On utilise l'algorithme bcrypt pour hasher le mot de passe des utilisateurs
const bcrypt = require("bcrypt");

// On utilise le package jsonwebtoken pour attribuer un token à un utilisateur au moment ou il se connecte
const jwt = require("jsonwebtoken");

// On récupère notre model User ,créer avec le schéma mongoose
const User = require("../models/User");

// Middleware pour crée un nouvel utilisateur
// On sauvegarde un nouvel utilisateur et crypte son mot de passe avec un hash généré par bcrypt
/**  Functions for user signup **/
const mailformat = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
exports.signup = (req, res) => {
  if (
    !(
      req.body.password.match(/[0-9]/g) &&
      req.body.password.match(/[A-Z]/g) &&
      req.body.password.match(/[a-z]/g) &&
      req.body.password.match(/[^a-zA-Z\d]/g) &&
      req.body.password.length >= 8
    )
  ) {
    return res.status(400).json({
      message:
        "Mot de passe doit contenir au moins 1 chiffre,au moins 1 majuscule,au moins 1 minuscule, ,au moins 1 caractère spécial,minimum 8 caractères.",
    });
  } else if (!req.body.email.match(mailformat)) {
    return res.status(400).json({
      message: "L'email n'est pas conforme.",
    });
  } else {
    // On appelle la méthode hash de bcrypt et on lui passe le mdp de l'utilisateur
    bcrypt
      .hash(req.body.password, 10)
      // On récupère le hash de mdp qu'on va enregister en tant que nouvel utilisateur dans la BBD mongoDB
      .then((hash) => {
        // Création du nouvel utilisateur avec le model mongoose
        const user = new User({
          // On passe l'email qu'on trouve dans le corps de la requête
          email: req.body.email,
          // On récupère le mdp hashé de bcrypt
          password: hash,
        });
        user
          .save()
          // On enregistre l'utilisateur dans la base de données
          .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
          .catch((error) => res.status(400).json({ error })); // Si il existe déjà un utilisateur avec cette adresse email
      })
      .catch((error) => res.status(500).json({ error }));
  }
};

// Le Middleware pour la connexion d'un utilisateur vérifie si l'utilisateur existe dans la base MongoDB lors du login
//si oui il vérifie son mot de passe, s'il est bon il renvoie un TOKEN contenant l'id de l'utilisateur, sinon il renvoie une erreur

const SECRET_TOKEN = process.env.SECRET_TOKEN;
/**  Functions for user login **/
exports.login = (req, res, next) => {
  // On doit trouver l'utilisateur dans la BDD qui correspond à l'adresse entrée par l'utilisateur
  User.findOne({ email: req.body.email })
    .then((user) => {
      // Si on trouve pas l'utilisateur on va renvoyer un code 401 "non autorisé"
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      // On utilise bcrypt pour comparer les hashs et savoir si ils ont la même string d'origine
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          // Si false, c'est que ce n'est pas le bon utilisateur, ou le mot de passe est incorrect
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          // Si true, on renvoie un statut 200 et un objet JSON avec un userID + un token
          res.status(200).json({
            // Le serveur backend renvoie un token au frontend
            userId: user._id,
            // Permet de vérifier si la requête est authentifiée
            // on va pouvoir obtenir un token encodé pour cette authentification grâce à jsonwebtoken, on va créer des tokens et les vérifier
            token: jwt.sign(
              // Encode un nouveau token avec une chaine de développement temporaire
              {
                userId: user._id,
              }, // Encodage de l'userdID nécéssaire dans le cas où une requête transmettrait un userId (ex: modification d'une sauce)
              SECRET_TOKEN, // Clé d'encodage du token qui peut être rendue plus complexe en production
              // Argument de configuration avec une expiration au bout de 24h
              {
                expiresIn: "24h",
              }
            ), // On encode le userID pour la création de nouveaux objets, et cela permet d'appliquer le bon userID
            // aux objets et ne pas modifier les objets des autres
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
