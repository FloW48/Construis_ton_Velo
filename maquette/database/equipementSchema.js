const mongoose = require("mongoose")
const Schema = mongoose.Schema

//Attributs de la collection 'Equipement'
const equipementSchema = new Schema({
    id_partie: Number,
    nom: String,
    prix: Number,
    lien: String,
    image: String,
});

const Equipement = mongoose.model('Equipement', equipementSchema)
module.exports = Equipement 