"use strict";

// Chargement des modules 
var express = require('express');
var app = express();

const server = require('http').createServer(app);

server.listen(8080, function() {
    console.log("C'est parti ! En attente de connexion sur le port 8080...");
});

// Configuration d'express pour utiliser le répertoire "public"
app.use(express.static('public'));
// set up to 
app.get('/', function(req, res) {  
    res.sendFile(__dirname + '/public/home.html');
});

//Import the mongoose module
var mongoose = require('mongoose');

mongoose.connect('mongodb://root:admin@localhost:27017/creer_ton_velo').then(() => console.log('Connected to MongoDB...')).catch((err) => console.error("Coudn't connect MongoDB....", err));

const { Schema } = mongoose;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const equipementSchema = new Schema({
    _id: Number, 
    id_partie: Number,
    prix: Number,
    lien: String,
    carbone: Number
});

const equipement = mongoose.model('Equipement',equipementSchema);

equipement.insertMany(
    {
        _id: 1, 
        id_partie: 1,
        prix: 30,
        lien: 'https://google.com',
        carbone: 10
    },
    {
        _id: 2, 
        id_partie: 2,
        prix: 50,
        lien: 'https://ldlc.com',
        carbone: 30
    },
    {
        _id: 3, 
        id_partie: 2,
        prix: 30,
        lien: 'selle.txt',
        carbone: 15
    },
    {
        _id: 4, 
        id_partie: 1,
        prix: 15,
        lien: 'guidon.super',
        carbone: 10
    }).then(function(){
        console.log("Data inserted")
    }).catch(function(error){
        console.log(error);
    });




