const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const veloSchema = new Schema({
    id_owner: String,
    id_cadre: Number,
    id_guidon: Number,
    id_pneus: Number,
    id_plateau: Number,
    id_selle : Number,
    nom: String,
    prix: Number,
    isBought: Boolean
});

const Velo = mongoose.model('Velo', veloSchema);
module.exports = Velo; 