// Création du router qui contient les fonctions qui s'appliquent aux différentes routes pour les sauces
// Dans le routeur on ne veut QUE la logique de routing, ainsi la logique métier sera enregistrée dans le controller sauce.js

// Ajout de plugin externe nécessaire pour utiliser le router d'Express
const express = require("express");

// Appel du routeur avec la méthode mise à disposition par Express
const router = express.Router();
const isOwner = require("../middleware/isOwner");

// Ajout des middleweares
// On importe le middleware auth pour sécuriser les routes
const auth = require("../middleware/auth"); // Récupère la configuration d'authentification JsonWebToken

//On importe le middleware multer pour la gestion des images
const multer = require("../middleware/multer-config");

// On associe les fonctions aux différentes routes, on importe le controller
const sauceCtrl = require("../controllers/sauce");

// En exportant dans le controller la logique métier, les fonctions, on voit plus clairement quelles sont les routes dont on dispose
// et on utilisera une sémantique très claire pour comprendre ce qu'elles permettent.
// On a quelque chose de plus modulaire plus facile à comprendre et plus facile à maintenir

// Création des différentes ROUTES de l'API en leurs précisant, dans l'ordre, leurs middlewares et controllers

// Route qui permet de récupérer toutes les sauces
// Renvoie le tableau de toutes les sauces depuis la base de données
router.get("/", auth, sauceCtrl.getAllSauces);

// Route qui permet de créer "une sauce"
// Capture et enregistre l'image, analyse la sauce en utilisant une chaîne de caractères et l'enregistre dans la base de données, en définissant correctement son image URL. Remet les sauces aimées et celles détestées à 0, et les sauces usersliked et celles usersdisliked aux tableaux vides.
router.post("/", auth, multer, sauceCtrl.createSauce);

// Route qui permet de cliquer sur une des sauces précise
// Renvoie la sauce avec l'ID fourni
router.get("/:id", auth, sauceCtrl.getOneSauce);

// Met à jour la sauce avec l'identifiant fourni. Si une image est téléchargée, capturez-la et mettez à jour l'imageURL des sauces. Si aucun fichier n'est fourni, les détails de la sauce figurent directement dans le corps de la demande(req.body.name,req.body.heat etc). Si un fichier est fourni, la sauce avec chaîne est en req.body.sauce.
router.put("/:id", auth, isOwner, multer, sauceCtrl.modifySauce);

// Supprime la sauce avec l'ID fourni.
router.delete("/:id", auth, sauceCtrl.deleteSauce);

// Route qui permet de gérer les likes des sauces
// Définit le statut "j'aime" pour userID fourni. Si j'aime = 1,l'utilisateur aime la sauce. Si j'aime = 0,l'utilisateur annule ce qu'il aime ou ce qu'il n'aime pas. Si j'aime =-1, l'utilisateur n'aime pas la sauce.L'identifiant de l'utilisateur doit être ajouté ou supprimé du tableau approprié, engardant une trace de ses préférences et en l'empêchant d'aimer ou de ne pas aimer la même sauce plusieurs fois. Nombre total de "j'aime" et de "je n'aime pas" à mettre à jour avec chaque "j'aime".
router.post("/:id/like", auth, multer, sauceCtrl.likeSauce);

module.exports = router;
