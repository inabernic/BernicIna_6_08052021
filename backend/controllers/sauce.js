const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  console.log(req.body);
  //res.status(200)//.json(req.body.sauce);

  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    dislikes: 0,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  console.log(sauce);
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      return res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

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
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
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
