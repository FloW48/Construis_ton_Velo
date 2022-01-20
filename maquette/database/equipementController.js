const Equipement = require('./equipementSchema')


const showAll = (req, res, next) => {
    Equipement.find()
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

const showPieces = (req, res, next) => {
    var pieceID = req.query.pieceID;

    Equipement.find({"id_partie": pieceID})
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

const newEquipement = (req, res, next) => {
    let equipement = new Equipement({
        _id: req.body._id, 
        id_partie: req.body.id_partie,
        nom: req.body.nom,
        prix: req.body.prix,
        lien: req.body.lien,
        image: req.body.image,
        carbone: req.body.carbone
    })
    equipement.save()
    .then(response => {
        res.json({
            message: "L'équipement a bien été ajouté"
        })
    })
    .catch(error => {
        res.json({            
            message: 'newEquipement: Une erreur est survenue'
        })
    })
}

const deleteAll  = (req, res, next) => {
    Equipement.deleteMany({})
    .then(response => {
        res.json({
            message: "Tous les équipements ont bien été supprimés"
        })
    })
    .catch(error => {
        res.json({            
            message: 'deleteAll: Une erreur est survenue'
        })
    })
}

const findMinPrice = (req, res, next) => {
    var pieceID = req.query.pieceID;

    Equipement.find({"id_partie": pieceID}).sort({prix: 1}).limit(1)
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'findMinPrice: Une erreur est survenue'
        })
    })
}



module.exports = {showAll, showPieces, newEquipement, deleteAll, findMinPrice} 