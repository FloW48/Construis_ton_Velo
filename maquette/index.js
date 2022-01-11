"use strict";

// Chargement des modules 
var express = require('express')
var bodyParser = require('body-parser') //Règle probleme de req.body = undefined lors de l'envoi d'une requete POST

var app = express();
const fetch = require('node-fetch')

const server = require('http').createServer(app);

const EquipementRoute = require('./database/equipementRoute')

const puppeteer = require('puppeteer');
const URL = "https://www.probikeshop.fr/bmx/bmx-street-dirt-cadres-c3258.html";

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

app.use('/api/equipement',EquipementRoute)



//Import the mongoose module
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/creer_ton_velo', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log('Connected to MongoDB...')).catch((err) => console.error("Coudn't connect MongoDB....", err));

const { Schema } = mongoose;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



//Récupère un élément depuis un lien et l'ajoute à la BD (pour l'instant: seulement image)
async function scrapeProduct(url){
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        headless: false,
    });
    const page = await browser.newPage();
    await page.goto(url);

    const [el] = await page.$x('/html/body/div[1]/div/div/div/div[2]/div[7]/div[2]/div[1]/div/a/div[1]/img');

    const src = await el.getProperty('src');
    const srcTxt = await src.jsonValue();

    console.log({srcTxt});

    browser.close();

    let piece = {
        _id: 20,
        id_partie: 1,
        nom: "cadre 7894789a489s4a189",
        prix: 250,
        lien: "iss.com",
        image: srcTxt,
        carbone: 50
    };
    
    fetch('http://localhost:8080/api/equipement/newEquipement', {
        method: 'POST',
        body: JSON.stringify(piece),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
      .then(json => console.log(json));

    return srcTxt;
}

//scrapeProduct(URL)


