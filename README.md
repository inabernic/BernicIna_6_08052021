# BernicIna_6_08052021, une API sécurisée pour l'application d'avis gastronomiques So Pekocko

Le sujet du projet 6 du parcours Développeur web chez Openclassrooms porte sur le développement d'une application d’évaluation des sauces piquantes pour la marque "So Pekocko". L'objectif étant de créer un MVP permettant aux utilisateurs d’ajouter leurs sauces préférées et de liker ou disliker les sauces ajoutées par les autres utilisateurs.


## API REST
Sécurité OWASP et RGPD

## Installation
Cloner ce projet depuis GitHub.
###  Faire tourner le Frontend
Ouvrir le terminal sur ce dossier et exécuter npm install pour installer les dépendances.
Exécuter npm install node-sass pour installer sass.
Le projet a été généré avec Angular CLI version 7.0.2.
Démarrer ng serve (ou npm start) pour avoir accès au serveur de développement.
Rendez-vous sur http://localhost:4200.
L'application va se recharger automatiquement si vous modifiez un fichier source.
###  Faire tourner le Backend
Ouvrir le terminal sur ce dossier.
Pour utiliser le serveur, chargez le package nodemon : npm install -g nodemon.
Puis lancez le serveur: nodemon server.

## Connexxion
Ouvrir localhost:4200 dans votre navigateur.
Pour s'inscrire sur l'application, l'utilisateur doit fournir un email et un mot de passe contenant 08 caractères minimum (dont 1 majuscule, 1 minuscule, 1 chiffre, pas de symbole, espaces autorisés).
Hébergement sur MongoDB Atlas
Toutes les opérations de la base de données utilisent le pack Mongoose avec des schémas de données stricts.

 La clé secrete JWT securisé, est pas presente en valeur par default dans le code source, le fichier est externalisé à l'aide du package dotenv. 
 Creer un fichier  .env avec les données 
 Cette donne est une cle que vous taper pas hasard. Par example pour le token codé et decodé on vas avoir la partie de connexion à la bdd (la partie utilisateur, la partie mdp  et la partie cluster), et les valeurs de cette clé qui va donner acces. aux utilisateur à la connexion.