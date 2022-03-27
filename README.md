# Construis_ton_Velo
Projet de 3e année de Licence Informatique : Construis ton Vélo

Installation de l'application:
- Se placer dans le répertoire 'Construis_ton_Velo'
- Installer les packages suivants un par un:        (En cas d'erreur, utiliser la commande 'npm audit fix')

    - npm install express --save
    - npm install puppeteer --save
    - npm install node-fetch@2.6.1 --save
    - npm install body-parser --save
    - npm install mongoose --save
    - npm install socket.io --save
    - npm install jspdf --save
    - npm install jsonwebtoken --save
    - npm install bcryptjs --save
    - npm install express-validator --save
    - npm install base64-stream --save
    - npm install pdfmake@0.2.4 --save
    - npm install portfinder --save

Version node:
    v14.18.1
Version npm:
    v6.14.15

Puis, pour lancer l'application: aller dans le dossier 'maquette' puis faire la commande 'node .'

- Pour utiliser la fonction de scrapping (les pièces sont déjà dans la BD, donc sauf si il y a de nouvelles pieces dans les sites sources, pas très utile): Se connecter avec le compte admin >
    Nom utilisateur: 'admin'
    Mot de passe: 'admin' 
Puis Bouton 'Lancer Scrapping' en haut à droite, puis lorsque c'est terminé, affichage du message 'scrapping terminé' dans la console du navigateur web

- Identiants mongodb Atlas (pour voir le contenu de la BD):
https://account.mongodb.com/account/login: 
email: paul.prenant@gmail.com
mot de passe: /;UFDSz5N-6Yx!d