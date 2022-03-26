const Equipement = require('./equipementSchema')

//Renvoi les informations de tous les équipements de la BD
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

//Retourne toutes les pièces d'un même type
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

//Retourne une pièce correspondant à un ID spécifique
const showPiece = (req, res, next) => {
    var pieceID = req.query.pieceID;
    
    Equipement.findById(pieceID)
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'showPiece: Une erreur est survenue'
        })
    })
}

//Ajoute un nouvel équipement dans la BD
const newEquipement = async (req, res, next) => {
    //Vérifie si la pièce existe déjà dans la BD selon son nom
    let equipementExistant= await Equipement.findOne({nom:req.body.nom})
    if(equipementExistant){
        return res.json({
            err:1,
            message: "Cette pièce est déjà présente."
        })
    }

    let equipement = new Equipement({
        id_partie: req.body.id_partie,
        nom: req.body.nom,
        prix: req.body.prix,
        lien: req.body.lien,
        image: req.body.image
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

//Supprime tous les équipements présents dans la BD
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

//Renvoi les informations de la pièce la moins chère correspondante à un certain type de pièce (pieceID)
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



module.exports = {showAll, showPieces, showPiece, newEquipement, deleteAll, findMinPrice} 