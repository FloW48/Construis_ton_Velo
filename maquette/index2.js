"use strict";

// Chargement des modules 
var express = require('express')
var bodyParser = require('body-parser') //Règle probleme de req.body = undefined lors de l'envoi d'une requete POST

var app = express();
const fetch = require('node-fetch')

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

app.use('/api/equipement',EquipementRoute)



//Import the mongoose module
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/creer_ton_velo', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log('Connected to MongoDB...')).catch((err) => console.error("Coudn't connect MongoDB....", err));

const { Schema } = mongoose;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));