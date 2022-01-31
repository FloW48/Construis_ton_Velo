const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const veloSchema = new Schema({
    _id: Number,
    id_cadre: Number,
    id_guidon: Number,
    id_pneus: Number,
    id_plateau: Number,
    id_selle : Number,
    nom: String,
    prix: Number
});

const Velo = mongoose.model('Velo', veloSchema);
module.exports = Velo; 