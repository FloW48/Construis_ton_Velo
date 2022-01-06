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
        prix: req.body.prix,
        lien: req.body.lien,
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

module.exports = {showAll, showPieces, newEquipement} 