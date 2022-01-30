const Velo = require('./veloSchema');


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

const newVelo = (req, res, next) => {
    let velo = new Velo({
        _id: req.body._id, 
        id_equipements: req.body.id_equipements,
        nom: req.body.nom,
        prix: req.body.prix
    })
    velo.save()
    .then(response => {
        res.json({
            message: "Le vélo a bien été ajouté"
        })
    })
    .catch(error => {
        res.json({            
            message: 'newEquipement: Une erreur est survenue'
        })
    })
}

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

module.exports = {showAll, showVelo, newVelo, deleteAll}