// On a ajouté le controller sauce avec une constante sauceCtrl dans le fichier sauce.js du router
// Récupération du modèle créé grâce à la fonction schéma de mongoose
// Récupération du modèle 'sauce'
const Sauce = require("../models/Sauce");

// Récupération du module 'file system' de Node permettant de gérer ici les téléchargements et modifications d'images
const fs = require("fs");

// Permet de créer une nouvelle sauce
exports.createSauce = (req, res, next) => {
  // On stocke les données envoyées par le front-end sous forme de form-data dans une variable en les transformant en objet js
  const sauceObject = JSON.parse(req.body.sauce);
  // On supprime l'id généré automatiquement et envoyé par le front-end. L'id de la sauce est créé par la base MongoDB lors de la création dans la base
  delete sauceObject._id;
  // Création d'une instance du modèle Sauce
  const sauce = new Sauce({
    ...sauceObject,
    dislikes: 0,
    // On modifie l'URL de l'image, on veut l'URL complète, quelque chose dynamique avec les segments de l'URL
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  // Sauvegarde de la sauce dans la base de données
  sauce
    .save()
    // On envoi une réponse au frontend avec un statut 201 sinon on a une expiration de la requête
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    // On ajoute un code erreur en cas de problème
    .catch((error) => res.status(400).json({ error }));
};

// Permet de récupérer une seule sauce, identifiée par son id depuis la base MongoDB
exports.getOneSauce = (req, res, next) => {
  // On utilise la méthode findOne et on lui passe l'objet de comparaison, on veut que l'id de la sauce soit le même que le paramètre de requête
  Sauce.findOne({
    _id: req.params.id,
  })
    // Si ok on retourne une réponse et l'objet
    .then((sauce) => {
      return res.status(200).json(sauce);
    })
    // Si erreur on génère une erreur 404 pour dire qu'on ne trouve pas l'objet
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

// Permet de modifier une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      //on recupere le nom de l'ancienne image
      const filename = sauce.imageUrl.split("/images/")[1];
      Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id }
      )
        .then(() => {
          if (req.file) {
            fs.unlink(`images/${filename}`, () =>
              // On supprime l'ancienne image du serveur
              console.log("unlink image:" + `images/${filename}`)
            );
          }
        })
        .then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Permet de supprimer la sauce
exports.deleteSauce = (req, res, next) => {
  // Avant de suppr l'objet, on va le chercher pour obtenir l'url de l'image et supprimer le fichier image de la base
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Pour extraire ce fichier, on récupère l'url de la sauce, et on le split autour de la chaine de caractères, donc le nom du fichier
      const filename = sauce.imageUrl.split("/images/")[1];
      // Avec ce nom de fichier, on appelle unlink pour suppr le fichier
      fs.unlink(`images/${filename}`, () => {
        // On supprime le document correspondant de la base de données
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Permet de récuperer toutes les sauces de la base MongoDB
exports.getAllSauces = (req, res, next) => {
  // On utilise la méthode find pour obtenir la liste complète des sauces trouvées dans la base, l'array de toutes les sauves de la base de données
  Sauce.find()
    // Si OK on retourne un tableau de toutes les données
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    // Si erreur on retourne un message d'erreur
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getAllThings = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error: error }));
};

// Permet de "liker"ou "dislaker" une sauce
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const userAvecDislike = sauce.usersDisliked.indexOf(req.body.userId) >= 0;
      const userAvecLike = sauce.usersLiked.indexOf(req.body.userId) >= 0;
      //cas like
      if (req.body.like == 1 && !userAvecLike) {
        sauce.likes += req.body.like;
        sauce.usersLiked.push(req.body.userId);
      }
      //cas dislike
      if (req.body.like == -1 && !userAvecDislike) {
        sauce.dislikes -= req.body.like;
        sauce.usersDisliked.push(req.body.userId);
      }
      //cas enleve like ou dislike
      if (req.body.like == 0) {
        //enleve dislike
        if (userAvecDislike) {
          sauce.dislikes--;
          sauce.usersDisliked.remove(req.body.userId);
        }
        //enleve like
        if (userAvecLike) {
          sauce.likes--;
          sauce.usersLiked.remove(req.body.userId);
        }
      }

      sauce.save();
    })
    .then(() => res.status(200).json({ message: "liked" }))
    .catch((error) => res.status(500).json({ error }));
};
