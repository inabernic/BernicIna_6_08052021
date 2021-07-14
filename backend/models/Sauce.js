// On importe mongoose
const mongoose = require("mongoose");

// Création d'un schema mangoose pour que les données de la base MongoDB ne puissent pas différer de
//celui précisé dans le schema Model des sauces. L'id est généré automatiquement par MongoDB
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: false },
  likes: { type: Number, required: false, default: 0 },
  dislikes: { type: Number, required: false },
  usersLiked: { type: [String], required: false },
  usersDisliked: { type: [String], required: false },
});

// On exporte ce shéma de données, on va donc pouvoir utiliser ce modèle pour intéragir avec l'application
module.exports = mongoose.model("Sauce", sauceSchema);
