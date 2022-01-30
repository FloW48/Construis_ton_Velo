const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const veloSchema = new Schema({
    _id: Number,
    id_equipements: String,
    nom: String,
    prix: Number
});

const Velo = mongoose.model('Velo', veloSchema);
module.exports = Velo; 