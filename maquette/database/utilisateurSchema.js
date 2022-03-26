const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Attributs de la collection 'Utilisateur'
const utilisateurSchema = new Schema({
    nom: String,
    firstname: String,
    lastname:String,
    password: String,
    email: String,
    tel: Number,
    ville: String,
    codepostal: Number,
    rue: String,
    admin: Boolean
});

const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);
module.exports = Utilisateur; 