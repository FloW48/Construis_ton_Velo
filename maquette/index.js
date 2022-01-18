"use strict";

// Chargement des modules 
var express = require('express')
var bodyParser = require('body-parser') //Règle probleme de req.body = undefined lors de l'envoi d'une requete POST
const puppeteer = require('puppeteer');
const fetch = require('node-fetch')

var app = express();

const URLCadres = "https://www.probikeshop.fr/bmx/bmx-street-dirt-cadres-c3258.html";
const URLPneus = "https://www.probikeshop.fr/bmx/bmx-street-dirt-roues-et-pneus-pneus-c3285.html";
const URLRoues = "https://www.probikeshop.fr/bmx/bmx-street-dirt-roues-et-pneus-roues-c3282.html";
const URLChaines = "https://www.probikeshop.fr/bmx/bmx-street-dirt-transmission-chaines-c3294.html";
const URLPlateaux = "https://www.probikeshop.fr/bmx/bmx-street-dirt-transmission-plateaux-c3297.html";
const URLSelle = "https://www.probikeshop.fr/bmx/bmx-street-dirt-peripheriques-selles-c3274.html";
const URLGuidon = "https://www.probikeshop.fr/bmx/bmx-street-dirt-peripheriques-guidons-c3268.html";


const server = require('http').createServer(app);

const EquipementRoute = require('./database/equipementRoute')

server.listen(8080, function() {
    console.log("C'est parti ! En attente de connexion sur le port 8080...");
});

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Configuration d'express pour utiliser le répertoire "public"
app.use(express.static('public'));
// set up to 
app.get('/', function(req, res) {  
    res.sendFile(__dirname + '/public/home.html');
});

app.use('/api/equipement',EquipementRoute);

//Import the mongoose module
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/creer_ton_velo', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log('Connected to MongoDB...')).catch((err) => console.error("Coudn't connect MongoDB....", err));

const { Schema } = mongoose;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Récupère le prix depuis un lien
async function scrapePrix(url){
    const browser = await puppeteer.launch();
    const page = await browser.newPage()
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

    await browser.close();

    console.log(prixTable); //Pour vérifier que ça extrait bien

    return prixTable;
}

async function scrapeNom(url){
    const browser = await puppeteer.launch();
    const page = await browser.newPage()
    await page.goto(url)

    //Scrapping des prix
    let nomTable = [];
    nomTable = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".product_title")).map(x => x.textContent);
    });

    await browser.close();

    console.log(nomTable); //Pour vérifier que ça extrait bien

    return nomTable;
}

//Récupère les images depuis un lien
async function scrapeImage(url){
    const browser = await puppeteer.launch();
    const page = await browser.newPage()
    await page.goto(url)

    let imgProduct = [];
    imgProduct = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".productBloc_img")).map(x => x.firstElementChild.getAttribute("data-src"));
    });

    console.log(imgProduct);

    await browser.close();

    /*const [el] = await page.$x('/html/body/div[1]/div/div/div/div[2]/div[7]/div[2]/div[1]/div/a/div[1]/img');
    const src = await el.getProperty('src');
    const srcTxt = await src.jsonValue();
    console.log({srcTxt});*/

    /*
    let piece = {
        _id: 20,
        id_partie: 1,
        nom: "cadre 7894789a489s4a189",
        prix: 250,
        lien: "iss.com",
        image: srcTxt[0],
        carbone: 50
    };
    
    fetch('http://localhost:8080/api/equipement/newEquipement', {
        method: 'POST',
        body: JSON.stringify(piece),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
      .then(json => console.log(json));

    return srcTxt;*/
}

//Fonction qui importe dans la BD les données prédéfinies dans le fichier 'dataPreset.json'
//Elle est appelée lors du clique sur le bouton 'IMPORTER DONNEES' sur la page principale
//  /!\ Supprime toutes les données déjà présentes dans la BD /!\
app.get('/importDataPreset', async function(req, res) {
    var dataPreset = require('./dataPreset.json') //Données prédéfinies à charger

    await fetch('http://localhost:8080/api/equipement/deleteAll');  //Supprime tous les éléments présents dans la collection 'Equipement'

    let index=0;

    dataPreset.forEach(function(element){
        let piece = {
            _id: index,
            id_partie: element.id_partie,
            nom: element.nom,
            prix: element.prix,
            lien: element.lien,
            image: element.image,
            carbone: element.carbone
        };
        console.log(piece)
        
        fetch('http://localhost:8080/api/equipement/newEquipement', {
            method: 'POST',
            body: JSON.stringify(piece),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json())
          .then(json => console.log(json));
          
        index ++;
    });
  });

//scrapePrix(URLCadres);
//scrapeImage(URLCadres);
scrapeNom(URLCadres);