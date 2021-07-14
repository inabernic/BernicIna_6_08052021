// Création d'un model user avec mongoose, on importe donc mongoose
const mongoose = require("mongoose");

// On rajoute ce validateur comme plugin, mais il est pas utilisé, car la validation j'ai fait avec les expressions regex
const uniqueValidator = require("mongoose-unique-validator");

// On crée notre schéma de données dédié à l'utilisateur
const userSchema = mongoose.Schema({
  // L'email doit être unique
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Plugin pour garantir un email unique
// On applique ce validateur au schéma avant d'en faire un modèle
userSchema.plugin(uniqueValidator);

// On exporte ce schéma sous forme de modèle : le modèle s'appellera user et on lui passe le shéma de données
module.exports = mongoose.model("User", userSchema);

// Pour s'assurer que deux utilisateurs ne peuvent pas utiliser la même adresse e-mail
// nous utiliserons le mot clé unique pour l'attribut email du schéma d'utilisateur userSchema.
// Les erreurs générées par défaut par MongoDB pouvant être difficiles à résoudre, nous installerons un package de validation
//pour pré-valider les informations avant de les enregistrer : npm install --save mongoose-unique-validator
