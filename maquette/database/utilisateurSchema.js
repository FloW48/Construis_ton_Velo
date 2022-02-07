const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const utilisateurSchema = new Schema({
    nom: String,
    email: String,
    password: String
});

const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);
module.exports = Utilisateur; 