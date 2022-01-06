const mongoose = require("mongoose")
const Schema = mongoose.Schema

const equipementSchema = new Schema({
    _id: Number, 
    id_partie: Number,
    prix: Number,
    lien: String,
    carbone: Number
});

const Equipement = mongoose.model('Equipement', equipementSchema)
module.exports = Equipement 