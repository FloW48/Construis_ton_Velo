"use strict";

// Chargement des modules 
var express = require('express')
var bodyParser = require('body-parser') //Règle probleme de req.body = undefined lors de l'envoi d'une requete POST
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
var FileReader = require('filereader')
var http = require('http');
var {Base64Encode} = require('base64-stream');
const Pdfmake = require('pdfmake');
var fs = require('fs');
var portfinder = require('portfinder');

var fonts = {
    Roboto: {
        normal: 'fonts/roboto/Roboto-Regular.ttf',
        bold: 'fonts/roboto/Roboto-Medium.ttf',
        italics: 'fonts/roboto/Roboto-Italic.ttf',
        bolditalics: 'fonts/roboto/Roboto-MediumItalic.ttf'
    }
};

var pdfmake = new Pdfmake(fonts);

var app = express();

//Liens utilisés pour le scrapping
const URLCadres = "https://www.probikeshop.fr/bmx/bmx-street-dirt-cadres-c3258.html";
const URLPneus = "https://www.probikeshop.fr/bmx/bmx-street-dirt-roues-et-pneus-pneus-c3285.html";
const URLGuidons = "https://www.probikeshop.fr/bmx/bmx-street-dirt-peripheriques-guidons-c3268.html";
const URLPlateaux = "https://www.probikeshop.fr/bmx/bmx-street-dirt-transmission-plateaux-c3297.html";
const URLSelles = "https://www.probikeshop.fr/bmx/bmx-street-dirt-peripheriques-selles-c3274.html";

const URLCadres2 ="https://www.bmxavenue.com/cadres-fourches-freestyle/cadres/"
const URLPneus2 = "https://www.bmxavenue.com/pneus-freestyle/pneus-rigides/"
const URLGuidons2 = "https://www.bmxavenue.com/cadres-fourches-freestyle/guidons/";
const URLPlateaux2 = "https://www.bmxavenue.com/transmissions-freestyle/couronnes-1/";
const URLSelles2 = "https://www.bmxavenue.com/selles-tiges-freestyle/selles-pivotal/";


const server = require('http').createServer(app);
const io = require('socket.io')(server);

//Récupère les routes des différentes collections de la BD, afin de pouvoir manipuler les données
const EquipementRoute = require('./database/equipementRoute')
const VeloRoute = require('./database/veloRoute')
const UtilisateurRoute = require('./database/utilisateurRoute')

let domain="http://localhost:"  //Début de la chaine qui sera utilisé pour les fonctions 'fetch'

//Recherche du premier port disponible (par défaut entre 8000 et 65535 (documentation 'portfinder') )
portfinder.getPort(function (err, port) {
    domain+=port
    server.listen(port, function() {
        console.log("C'est parti ! En attente de connexion sur le port " + port);
    });
  });



app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// Configuration d'express pour utiliser le répertoire "public"
app.use(express.static('public'));

app.get('/', function(req, res) {  
    res.sendFile(__dirname + '/public/home.html');
});

//Utilisation des routes pour la manipulation des données des différentes collection
app.use('/api/equipement',EquipementRoute);
app.use('/api/utilisateur',UtilisateurRoute);
app.use('/api/velo',VeloRoute);


//Import the mongoose module
var mongoose = require('mongoose');

//Connexion à la BD
mongoose.connect('mongodb+srv://projetl3velo:VxWuKP9w5MFT7U%40@cluster0.t5na3.mongodb.net/creerTonVelo?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log('Connected to MongoDB...')).catch((err) => console.error("Coudn't connect MongoDB....", err));

const { Schema } = mongoose;
//Récupère la connexion
var db = mongoose.connection;

//Récupère les informations en cas d'erreur de connexion
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


/**
 * Fonction de scrapping permettant de récupérer les données du site bmxavenue.com
 * @param {string} url - Lien complet de la page à 'scrapper'
 * @param {string} id_partie - Identifiant de la partie du vélo correspondante (1: Cadre, 2: Pneus, 3: Guidon, 4: Selle, 5: Plateau)
*/
async function scrapeElements2(url,id_partie){
    const browser = await puppeteer.launch();
    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(0);
    await page.goto(url)

    //Scrapping prix
    let prixTable = [];
    prixTable = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".prod__price__cur")).map(x => x.firstElementChild.textContent.slice(0, -1).replace(/,/g, "."));
    });


    //Scrapping des noms
    let nomsTable = [];
    nomsTable = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".prod__name__title")).map(x => x.innerHTML);
    });

    //Scrapping des images
    let imagesTable = [];
    imagesTable = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".prod__picture")).map(x => x.lastElementChild.getAttribute("data-src"));
    });

    //Scrapping des liens
    let liensTable = [];
    liensTable = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".prod__relative")).map(x => "https://www.bmxavenue.com" + x.firstElementChild.children[4].getAttribute("href"));
    });


    await browser.close()
    
    let nb_elem=imagesTable.length;//Nombre d'éléments récupérés
    

    //Pour chaque pièces, ajout dans la BD
    for(let i=0;i<nb_elem;i++){
        let piece = {
            id_partie: id_partie,
            nom: nomsTable[i],
            prix: prixTable[i],
            lien: liensTable[i],
            image: imagesTable[i],
            carbone: 50
        };
        
        let fetch_url=domain+'/api/equipement/newEquipement'
        fetch(fetch_url, {
            method: 'POST',
            body: JSON.stringify(piece),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json())
          .then(json => console.log(json));
    }
}

/**
 * Fonction de scrapping permettant de récupérer les données du site probikeshop.fr
 * @param {string} url - Lien complet de la page à 'scrapper'
 * @param {string} id_partie - Identifiant de la partie du vélo correspondante (1: Cadre, 2: Pneus, 3: Guidon, 4: Selle, 5: Plateau)
*/
async function scrapeElements(url, id_partie){
    const browser = await puppeteer.launch();
    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(0);
    await page.goto(url)

    //Scrapping des prix
    let prixTable = [];
    prixTable = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".product_price")).map(x => x.textContent);
    });
    prixTable = prixTable.map(function (el) {
        return el.trim().split(/[0-9]{1-5},[0-9]{2}/);
    });
    for(let i =0; i <prixTable.length; i++){
        prixTable[i][0] = prixTable[i][0].replace(/,/g, ".");
        if(prixTable[i][0].includes('-')){
            prixTable[i] = prixTable[i][0].substring(32,38);
        }
        if(prixTable[i][0].includes('€')){
            prixTable[i] = prixTable[i][0].substring(0,6);
        }
    }
    for(let i=0; i<prixTable.length; i++){
        prixTable[i] = parseFloat(prixTable[i]);
    }

    //Scrapping des images
    let imagesTable = [];
    imagesTable = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".productBloc_img")).map(x => x.firstElementChild.getAttribute("data-src"));
    });

    //Scrapping des noms
    let nomsTable = [];
    nomsTable = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".product_title")).map(x => x.textContent);
    });
    
    //Scrapping des liens
    let liensTable = [];
    liensTable = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".product_link")).map(x => "https://www.probikeshop.fr" + x.getAttribute("href"));
    });

    await browser.close();

    let nb_elem=imagesTable.length; //Nombre d'éléments récupérés
    

    //Pour chaque pièces, ajout dans la BD
    for(let i=0;i<nb_elem;i++){
        let piece = {
            id_partie: id_partie,
            nom: nomsTable[i],
            prix: prixTable[i],
            lien: liensTable[i],
            image: imagesTable[i],
        };
        
        let fetch_url=domain+'/api/equipement/newEquipement'

        fetch(fetch_url, {
            method: 'POST',
            body: JSON.stringify(piece),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json())
          .then(json => console.log(json));
    }
}

//Fonction générale lançant tous les scrapping nécéssaires
async function scrapAll(){
    await scrapeElements(URLCadres,1);
    await scrapeElements(URLPneus,2);
    await scrapeElements(URLGuidons,3);
    await scrapeElements(URLPlateaux,4);
    await scrapeElements(URLSelles,5);
    await scrapeElements2(URLCadres2,1);
    await scrapeElements2(URLPneus2,2);
    await scrapeElements2(URLGuidons2,3);
    await scrapeElements2(URLPlateaux2,4);
    await scrapeElements2(URLSelles2,5);

    console.log("Scrapping: OK")
}

//Lors de la connexion d'un utilisateur
io.on('connection', function (socket) {
    console.log("Un client s'est connecté");

    //Fonction de l'initialisation des données pour la facture au format PDF + appel de la fonction de création du PDF
    socket.on("facturePDF", async (infosFacture)=> {
        let info = [];  //Tableau comprenant les informations du vélo, le prix total et les informations de l'utilisateur
        let velo=infosFacture.veloPieces    //Stockage des informations des pièces
        let total = 0;  //Prix total du vélo
        for(let i = 0;i<5;i++){
            
            let nom = velo[i].nom;
            let prix = Math.round(velo[i].prix * 100) / 100;
            if(i == 1) prix*=2; //Pour les pneux, prix multiplié par 2
            total += prix;
            let lien = velo[i].lien;

            let imageBase64
            var formatImage = velo[i].image.split('.').pop();   //Récupère le format de l'image en séparant l'URL en utilisant le "." comme séparateur et récupére la dernière valeur
            if(formatImage=="gif"){ //Le format gif n'est pas accepté par pdfmake pour l'insertion d'image, donc on remplace l'image de la pièce par une image d'erreur 
                imageBase64 ="./images/erreurImage.jpg"
            }else{
                imageBase64=await base64Image(velo[i].image)
            }
        
            info.push({'nom':nom,'prix':prix,'lien':lien,'imageBase64':imageBase64});
        }
        info.push(total);   //Index 5: Prix total
        info.push(infosFacture.autresInfos) //Index 6: autres infos: nomVelo et informations du client (nom, adresse, telephone, mail..)


        makePDF({
            data: info
        }).then(file => {
            console.log(file);
        });

    });

    //Lorsque l'utilisateur demande le lancement du scrapping via un clique sur le bouton associé (compte admin uniquement)
    socket.on("lancerScrapping", async ()=>{
        console.log("lancerScrapping recu")
        await scrapAll()
        io.sockets.emit("scrappingOK")  //Prévient le client lors de la fin du scrapping
    })

    /**
     * Conversion d'une image .jpg via son lien en une chaine de caractère en base64
     * @param {string} image - URL de l'image
     */

    async function base64Image(image){
        let base64=await fetch(image).then(r => r.buffer()).then(buf => `data:image/${"jpg"};base64,`+buf.toString('base64'));

        return base64
    }

    //Renvoi au client la valeur encodée d'une image jpg en base64
    socket.on("askImgBase64",async function(image, callback){
        let base64=await fetch(image).then(r => r.buffer()).then(buf => `data:image/${"jpg"};base64,`+buf.toString('base64'));
        callback(base64)
    })

    /**
     * Création du PDF de la facture
     * @param {array} datas - Tableau comprenant les informations du vélo et de l'utilisateur
     */
    const makePDF = (datas) => {
        let aPromise = new Promise((resolve, reject) => {
            console.time('creatingPDF')
            
            //Récupère la date et l'heure exacte, pour le nom du fichier
            const d = new Date();
            let currDate=d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear() + "-" + d.getHours() + "-" + d.getMinutes() + "-" + d.getSeconds()
            
            //Génération du nom du PDF: date + heure + nom du vélo
            let nomPDF=currDate+"-"+datas.data[6].nomVelo;
            
            //Informations de l'utilisateur, affichée en haut à gauche du PDF
            let titreVelo="Votre vélo \""+datas.data[6].nomVelo+"\""
            let nomClient=datas.data[6].nomClient
            let nomPrenomClient=datas.data[6].nomFamilleClient + " " + datas.data[6].prenomClient
            let rue=datas.data[6].rueClient
            let cpVille= datas.data[6].cpClient==-1 ? "" : datas.data[6].cpClient + " " + datas.data[6].villeClient
            let tel= datas.data[6].telClient==-1 ? "" : "0"+datas.data[6].telClient
            let email=datas.data[6].emailClient

            var doc = {
                content: [
                    { text : 'MakeYourBMX',style: 'nosCoords'},     //Coordonnées fictives du site (en haut à droite du PDF)
                    { text : '16 route de Gray', style : 'nosCoords' },
                    { text : '25000 Besançon', style : 'nosCoords'},
        
                    { text : titreVelo,style: 'utilCoords'},
                    { text : nomClient, style : 'utilCoords'},
                    { text : nomPrenomClient, style : 'utilCoords'},
                    { text : rue, style : 'utilCoords' },
                    { text : cpVille, style : 'utilCoords'},
                    { text : tel, style : 'utilCoords'},
                    { text : email, style : 'utilCoords'},
                    { style: 'table',
                        table: {                                //Tableau récapitulatif des pièces du vélo
                            heights: [10, 30, 30,30,30,30,30],
                            widths: [200, 250, 50,50],
                            body: [
                                [{text:'Nom', style:'tableHeader'}, {text:'Lien', style:'tableHeader'}, {text:'Prix Unité', style:'tableHeader'}],
                                [datas.data[0].nom, datas.data[0].lien, datas.data[0].prix],
                                [datas.data[1].nom, datas.data[1].lien, datas.data[1].prix],
                                [datas.data[2].nom, datas.data[2].lien, datas.data[2].prix],
                                [datas.data[3].nom, datas.data[3].lien, datas.data[3].prix],
                                [datas.data[4].nom, datas.data[4].lien, datas.data[4].prix],
                                [{text:'Total', style:'tableHeader'},'',{fillColor: 'red', text: Math.round(datas.data[5] * 100) / 100+'\u20AC'}]
                            ],
                        },
                    },
                    {               //Affichage des images des pièces
                        columns: [
                          {
                            image: datas.data[0].imageBase64,
                            width: 100
                          },
                          {
                            image: datas.data[1].imageBase64,
                            width: 100
                          },
                          {
                            image: datas.data[2].imageBase64,
                            width: 100
                          },
                          {
                            image: datas.data[3].imageBase64,
                            width: 100
                          },
                          {
                            image: datas.data[4].imageBase64,
                            width: 100
                          }
                        ],
                        columnGap: 10
                    },
                ],
                styles: {
                   nosCoords: {
                        italic: true,
                        fontSize: 13,
                        alignment: 'right',
                        margin :1
                    },
                    utilCoords: {
                        fontSize: 15,
                        bold: true,
                        alignment: 'left',
                        margin: 2
                    },
                    table: {
                        margin: [0, 50, 0, 15]
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 13,
                        color: 'black',
                        alignment : 'center'
                    }
                },
            };


            let pdfDoc = pdfmake.createPdfKitDocument(doc, {});

            let path="./public/"+nomPDF+".pdf"
            let writeStream = fs.createWriteStream(path);

            pdfDoc.pipe(writeStream);
            pdfDoc.end();

            writeStream.on('finish', function () {      //Création du fichier du PDF et écriture dans le stockage côté serveur
                console.timeEnd('creatingPDF');
                resolve(nomPDF+".pdf");
                socket.emit("pdfPath",nomPDF)
            });

        })

        return aPromise;
    }


    
})

