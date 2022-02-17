"use strict";

// Chargement des modules 
var express = require('express')
var bodyParser = require('body-parser') //Règle probleme de req.body = undefined lors de l'envoi d'une requete POST
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
var FileReader = require('filereader')
var http = require('http');
var {Base64Encode} = require('base64-stream');
const jspdf = require('jspdf');

var app = express();

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

const EquipementRoute = require('./database/equipementRoute')
const UtilisateurRoute = require('./database/utilisateurRoute')

server.listen(8080, function() {
    console.log("C'est parti ! En attente de connexion sur le port 8080...");
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
// set up to 
app.get('/', function(req, res) {  
    res.sendFile(__dirname + '/public/home.html');
});

app.use('/api/equipement',EquipementRoute);
app.use('/api/utilisateur',UtilisateurRoute);

//Import the mongoose module
var mongoose = require('mongoose');
const { setgroups } = require('process');
const { isDeepStrictEqual } = require('util');

mongoose.connect('mongodb://localhost:27017/creer_ton_velo', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log('Connected to MongoDB...')).catch((err) => console.error("Coudn't connect MongoDB....", err));

const { Schema } = mongoose;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


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


var index=0;    //ID pour les éléménts de la BD
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
    //console.log(prixTable);


    //Scrapping des noms
    let nomsTable = [];
    nomsTable = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".prod__name__title")).map(x => x.innerHTML);
    });
    //console.log(nomsTable);

    //Scrapping des images
    let imagesTable = [];
    imagesTable = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".prod__picture")).map(x => x.lastElementChild.getAttribute("data-src"));
    });
    //console.log(imagesTable);

    //Scrapping des liens
    let liensTable = [];
    liensTable = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".prod__relative")).map(x => "https://www.bmxavenue.com" + x.firstElementChild.children[4].getAttribute("href"));
    });
    //console.log(liensTable);


    await browser.close()
    
    let nb_elem=imagesTable.length;
    

    for(let i=0;i<nb_elem;i++){
        let piece = {
            _id: index,
            id_partie: id_partie,
            nom: nomsTable[i],
            prix: prixTable[i],
            lien: liensTable[i],
            image: imagesTable[i],
            carbone: 50
        };
        
        fetch('http://localhost:8080/api/equipement/newEquipement', {
            method: 'POST',
            body: JSON.stringify(piece),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json())
          .then(json => console.log(json));
          index++;
    }
}

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

    console.log(prixTable)

    //Scrapping des images
    let imagesTable = [];
    imagesTable = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".productBloc_img")).map(x => x.firstElementChild.getAttribute("data-src"));
    });
    console.log(imagesTable);

    //Scrapping des noms
    let nomsTable = [];
    nomsTable = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".product_title")).map(x => x.textContent);
    });
    console.log(nomsTable);
    
    //Scrapping des liens
    let liensTable = [];
    liensTable = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".product_link")).map(x => "https://www.probikeshop.fr" + x.getAttribute("href"));
    });
    console.log(liensTable);

    await browser.close();

    let nb_elem=imagesTable.length;
    

    for(let i=0;i<nb_elem;i++){
        let piece = {
            _id: index,
            id_partie: id_partie,
            nom: nomsTable[i],
            prix: prixTable[i],
            lien: liensTable[i],
            image: imagesTable[i],
            carbone: 50
        };
        
        fetch('http://localhost:8080/api/equipement/newEquipement', {
            method: 'POST',
            body: JSON.stringify(piece),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json())
          .then(json => console.log(json));
          index++;
    }
}

async function scrapAll(){
    await fetch('http://localhost:8080/api/equipement/deleteAll');  //Supprime tous les éléments présents dans la collection 'Equipement'
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

var getImageFromUrl = function(url, callback) {
	var img = new Image();
	img.src = url;
	img.onError = function() {
		throw new Error('Cannot load image: "'+url+'"');
	}
	img.onload = function() {
		var canvas = document.createElement('canvas');
		document.body.appendChild(canvas);
		canvas.width = img.width;
		canvas.height = img.height;

		var ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0);
		// Grab the image as a jpeg encoded in base64, but only the data
		data = canvas.toDataURL('image/jpeg').slice('data:image/jpeg;base64,'.length);
		// Convert the data to binary form
		data = atob(data)
		document.body.removeChild(canvas);

		ret['data'] = data;
		ret['pending'] = false;
		if (typeof callback === 'function') {
			callback(data);
		}
	}

	return ret;
}

var createImagePDF = function (doc,imgData){
    doc.addImage(imgData,'JPEG',70,10,100,120);
    doc.output('datauri');
}

io.on('connection', function (socket) {
    console.log("Un client s'est connecté");


    socket.on("changePiece",()=>{
        console.log("update reçu");
    });

    socket.on("sauvegarder", (velo)=> {
        let doc = new jspdf.jsPDF();
        doc.setProperties({
            title: 'Votre vélo',
            subject: 'Eléments de votre vélo',		
            author: 'Paul Prenant, Tanguy Crussard',
            keywords: 'generated, javascript, web 2.0, ajax',
        });
        for(let i = 0;i<5;i++){
            if(i!==0) doc.addPage();
            let nom = velo[i].nom;
            let prix = velo[i].prix;
            let lien = velo[i].lien;
            let url = velo[i].image;
            doc.setFontSize(15);
            doc.setTextColor("black");
            doc.text(nom,10,10);
            doc.setTextColor(255,0,0);
            doc.setFontSize(16);
            doc.text(String(prix),100,50);
            doc.setTextColor(100);
            doc.setFontSize(10)
            doc.text(lien,15,275);
            //getImageFromUrl(doc,url,createImagePDF);
        }
        doc.save("Votre vélo.pdf");
    });

    socket.on("lancerScrapping", async ()=>{
        console.log("lancerScrapping recu")
        await scrapAll()
        io.sockets.emit("scrappingOK")
    })


    //Renvoi au client la valeur encodée d'une image jpg en base64
    socket.on("askImgBase64",async function(image, callback){
        let base64=await fetch(image).then(r => r.buffer()).then(buf => `data:image/${"jpg"};base64,`+buf.toString('base64'));
        callback(base64)
    })





    
})