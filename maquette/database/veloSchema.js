const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Attributs de la collection 'Velo'
const veloSchema = new Schema({
    id_owner: String,
    id_cadre: String,
    id_guidon: String,
    id_pneus: String,
    id_plateau: String,
    id_selle : String,
    nom: String,
    prix: Number,
    isBought: Boolean
});

const Velo = mongoose.model('Velo', veloSchema);
module.exports = Velo; 


