const Velo = require('./veloSchema');

//Renvoi tous les vélos de la BD
const showAll = (req, res, next) => {
    Velo.find()
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'showAll: Une erreur est survenue'
        })
    })
}

//Renvoi un vélo selon son identifiant
const showVelo = (req, res, next) => {
    var veloID = req.query.veloID;

    Velo.find({"id_velo": veloID})
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'showPieces: Une erreur est survenue'
        })
    })
}

//Renvoi tous les vélos liés à un utilisateur
const showVelosOfUser = (req, res, next) => {
    var userID = req.query.userID;

    Velo.find({"id_owner": userID})
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'showVelosOfUser: Une erreur est survenue'
        })
    })
}

//Ajoute un nouveau vélo dans la BD grâce aux informations transmises
const newVelo = (req, res, next) => {
    let velo = new Velo({
        id_owner: req.body.id_owner,
        id_cadre: req.body.id_cadre,
        id_pneus: req.body.id_pneus,
        id_guidon: req.body.id_guidon,
        id_plateau: req.body.id_plateau,
        id_selle: req.body.id_selle,
        nom: req.body.nom,
        prix: req.body.prix,
        isBought: false
    })
console.log(velo)
    velo.save()
    .then(response => {
        res.json({
            message: "Le vélo a bien été ajouté"
        })
    })
    .catch(error => {
        res.json({            
            message: 'newVelo: Une erreur est survenue'
        })
    })
}

//Supprime tous les vélos de la BD
const deleteAll  = (req, res, next) => {
    Velo.deleteMany({})
    .then(response => {
        res.json({
            message: "Tous les vélos ont bien été supprimés"
        })
    })
    .catch(error => {
        res.json({            
            message: 'deleteAll: Une erreur est survenue'
        })
    })
}

//Supprime un vélo selon son identifiant
const deleteOne  = (req, res, next) => {
    let id = req.query.veloID

    Velo.findByIdAndRemove(id)
    .then(response => {
        res.json({
            err:0,
            message: "Le vélo a bien été supprimé"
        })
    })
    .catch(error => {
        res.json({
            err:1,  
            message: 'deleteOne: Une erreur est survenue'
        })
    })
}

//Change le boolean isBought de 'false' à 'true'
const acheterVelo = (req, res , next) => {
    let id = req.query.veloID

    Velo.findByIdAndUpdate(id, {$set: {isBought: true}}).then(()=>{
        res.json({
            err: 0,
            message: "Vélo mis à jour"
        })
    }).catch(()=>{
        res.json({
            err: 1,
            message: "acheterVelo: Une erreur est survenue"
        })
    })

}

module.exports = {showAll, showVelo, showVelosOfUser, newVelo, deleteAll, deleteOne, acheterVelo}