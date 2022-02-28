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

const newVelo = (req, res, next) => {
    let velo = new Velo({
        id_owner: req.body.id_owner,
        id_cadre: req.body.id_cadre,
        id_pneus: req.body.id_pneus,
        id_guidon: req.body.id_guidon,
        id_plateau: req.body.id_plateau,
        id_selle: req.body.id_selle,
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
            message: 'newVelo: Une erreur est survenue'
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

const updateVelo = (req, res , next) => {
    let veloID = req.body.veloID

    let updatedData = {
        id_cadre: req.body.id_cadre,
        id_guidon: req.body.id_guidon,
        id_pneus: req.body.id_pneus,
        id_plateau: req.body.id_plateau,
        id_selle: req.body.id_selle,
        nom: req.body.nom,
        prix: req.body.prix
    }

    Velo.findByIdAndUpdate(veloID, {$set: updatedData}).then(()=>{
        res.json({
            message: "Velo updated successfully"
        })
    }).catch(()=>{
        res.json({
            message: "Error on update"
        })
    })

}

module.exports = {showAll, showVelo, showVelosOfUser, newVelo, deleteAll, updateVelo}