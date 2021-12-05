//Import the mongoose module
var mongoose = require('mongoose');

mongoose.createConnection('mongodb://admin:admin@localhost:27017/creer_ton_velo');

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const equipementSchema = new Schema({
    id: Number, 
    id_partie: Number,
    prix: Number,
    lien: String,
    carbone: Number
});

const equipement = mongoose.model('Equipement',equipementSchema);

equipement.insertMany(
    {
        id: 1, 
        id_partie: 1,
        prix: 30,
        lien: 'https://google.com',
        carbone: 10
    },
    {
        id: 2, 
        id_partie: 2,
        prix: 50,
        lien: 'https://ldlc.com',
        carbone: 30
    },
    {
        id: 3, 
        id_partie: 2,
        prix: 30,
        lien: 'selle.txt',
        carbone: 15
    },
    {
        id: 4, 
        id_partie: 1,
        prix: 15,
        lien: 'guidon.super',
        carbone: 10
    }).then(function(){
        console.log("Data inserted")
    }).catch(function(error){
        console.log(error);
    });

let buttonGuidon = document.getElementById("onlyguidon");

buttonGuidon.addEventListener("click", ()=>{
    console.log("Voici tous les guidons : ");
    console.log(equipement.aggregate({
        $filter: {
            id_partie: 1
        }
    }));
    console.log("Test une fonction juste après");
    console.log(db.getCollection('equipement').find({}));
});



