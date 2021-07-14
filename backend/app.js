// App.js fait appel aux différentes fonctions implémentées dans l'APi : Accès aux images, aux route User, aux route Sauce

// utilisation du module 'dotenv' pour masquer les informations de connexion à la base de données à l'aide de variables d'environnement
require("dotenv").config();

// import des modules npm - Ajout des plugins externes
const express = require("express"); // Importation d'express => Framework basé sur node.js

// Pour gérer la demande POST provenant de l'application front-end, nous devrons être capables d'extraire l'objet JSON de la demande, on importe donc body-parser
const bodyParser = require("body-parser"); // Permet d'extraire l'objet JSON des requêtes POST

// On importe mongoose pour pouvoir utiliser la base de données
const mongoose = require("mongoose"); // Plugin Mongoose pour se connecter à la data base Mongo Db

// On donne accès au chemin de notre système de fichier
const path = require("path"); // Plugin qui sert dans l'upload des images et permet de travailler avec les répertoires et chemin de fichier

// Déclaration des routes
// On importe la route dédiée aux sauces
const sauceRoutes = require("./routes/sauce");

// On importe la route dédiée aux utilisateurs
const userRoutes = require("./routes/user");
const Sauce = require("./models/Sauce");

// Connection to MongoBD and masking of ID, MPD, ADDRESS with DOTENV
const ID = process.env.ID;
const MDP = process.env.PASS;
const ADDRESS = process.env.ADDRESS;

// Connection à la base de données MongoDB avec la sécurité vers le fichier .env pour cacher le mot de passe
// L'un des avantages que nous avons à utiliser Mongoose pour gérer notre base de données MongoDB est que nous pouvons implémenter des schémas de données stricts
// qui permettent de rendre notre application plus robuste
mongoose
  .connect(`mongodb+srv://${ID}:${MDP}@${ADDRESS}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

//CORS - Blocks HTTP calls between different servers
// Middleware Header pour contourner les erreurs en débloquant certains systèmes de sécurité CORS, afin que tout le monde puisse faire des requetes depuis son navigateur
app.use((req, res, next) => {
  // on indique que les ressources peuvent être partagées depuis n'importe quelle origine
  res.setHeader("Access-Control-Allow-Origin", "*");
  // on indique les entêtes qui seront utilisées après la pré-vérification cross-origin afin de donner l'autorisation
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  // on indique les méthodes autorisées pour les requêtes HTTP
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  // on autorise ce serveur à fournir des scripts pour la page visitée
  next();
});

// On utilise une méthode body-parser pour la transformation du corps de la requête en JSON, en objet JS utilisable
// Sachant que l'on va créer une requête post pour permettre à l'utilisateur de mettre en ligne une sauce sur la base d'un schéma créer dans Sauce.js
// il va falloir traiter les données associées à cette requête, autrement dit d'extraire l'objet JSON de la demande en provenance du frontend : on aura recours à body-parser.
// Il faut qu'elle soit soit formatée pour être utilisée
// Transforme les données arrivant de la requête POST en un objet JSON facilement exploitable
app.use(bodyParser.json());

// Gestion de la ressource image de façon statique
// Midleware qui permet de charger les fichiers qui sont dans le repertoire images
app.use("/images", express.static(path.join(__dirname, "images")));

// Routes pour la gestion de toute les ressources de l'API attendues - Routage
// Middleware qui va transmettre les requêtes vers ces url vers les routes correspondantes

// Va servir les routes dédiées aux sauces
app.use("/api/sauces", sauceRoutes);

// Va servir les routes dédiées aux utilisateurs
app.use("/api/auth", userRoutes);

// Export de l'application express pour déclaration dans server.js
module.exports = app;
