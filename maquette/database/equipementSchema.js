const mongoose = require("mongoose")
const Schema = mongoose.Schema

const equipementSchema = new Schema({
    _id: Number,
    id_partie: Number,
    nom: String,
    prix: Number,
    lien: String,
    image: String,
    carbone: Number
});

const Equipement = mongoose.model('Equipement', equipementSchema)
module.exports = Equipement 