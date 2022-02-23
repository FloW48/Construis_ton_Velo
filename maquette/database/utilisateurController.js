const Utilisateur = require('./utilisateurSchema');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const showAll = (req, res) => {
    Utilisateur.find()
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

const showUtilisateur = (req, res) => {
    var nom = req.query.nom;

    Utilisateur.find({"nom": nom})
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'showUtilisateur: Une erreur est survenue'
        })
    })
}

const showMe = async (req, res) => {
    try {
        const user = await Utilisateur.findById(req.user.id);
        res.json(user);
    } catch (e) {
        res.send({ message: "Erreur recup utilisateur"});
    }
}

const registerUtilisateur = async (req, res, next) => {
    
    let utilisateur = new Utilisateur({
        nom: req.body.name,
        password: req.body.password
    })
    
    try{
        let utilisateurExistant= await Utilisateur.findOne({nom:req.body.name})
        if(utilisateurExistant){
            return res.json({
                err:1,
                message: "Cet utilisateur existe déjà"
            })
        }

        const salt = await bcrypt.genSalt(10);
        utilisateur.password = await bcrypt.hash(utilisateur.password, salt);
        await utilisateur.save()
        
        return res.json({
            err:0,
            message: "Enregistrement OK"
        })

    }catch(erreur){
        res.json({            
            err:2,
            message: 'registerUtilisateur: Une erreur est survenue'
        })
    }

}

//Connexion d'un utilisateur existant
const loginUtilisateur = async (req, res, next) => {
    let nom= req.body.name
    let password= req.body.password
    
    try{
        let user= await Utilisateur.findOne({nom: nom})
        
        if(!user){
            return res.json({
                err:1,
                message: "L'utilisateur n'existe pas!"
            });
        };

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.json({
                err:2,
                message: "Mot de passe incorrect!"
            });
        };


        return res.json({
            err:0,
            message: "Connexion OK"
        })

    }catch (erreur) {
        console.error(erreur);
        res.json({
          message: "Erreur serveur"
        });        
      }
}


const deleteUtilisateur  = (req, res, next) => {
    let name = req.body.name

    Utilisateur.deleteOne({nom:name})
    .then(response => {
        res.json({
            message: "L'utilisateur a bien été supprimé"
        })
    })
    .catch(error => {
        res.json({            
            message: 'deleteUtilisateur: Une erreur est survenue'
        })
    })
}

const updateUtilisateur = (req, res , next) => {
    let nom = req.body.nom

    let updatedUtilisateur = {
        nom: req.body.nom,
        email: req.body.email,
        password: req.body.password
    }

    Utilisateur.findOneAndUpdate({nom:nom}, {$set: updatedUtilisateur}).then(()=>{
        res.json({
            message: "User updated successfully"
        })
    }).catch(()=>{
        res.json({
            message: "Error on update"
        })
    })

}

module.exports = {showAll, showUtilisateur, showMe, registerUtilisateur, loginUtilisateur, deleteUtilisateur, updateUtilisateur}