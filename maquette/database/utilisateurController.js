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
    var id = req.query.userID;
    console.log(id)
    Utilisateur.findById(id)
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
    
    if(!/^([a-zA-Z0-9]{3,12})$/.test(req.body.name)){
        return res.json({
            message: "Le format du nom d'utilisateur est incorrect.",
            err:3
        })
    }
    if(!/^([a-zA-Z0-9]{4,16})$/.test(req.body.password)){
        return res.json({
            message: "Le format du mot de passe est incorrect.",
            err:4
        })
    }

    let utilisateur = new Utilisateur({
        nom: req.body.name,
        password: req.body.password,
        firstname:"",
        lastname:"",
        email: "",
        tel:-1,
        ville: "",
        codepostal: -1,
        rue: "",
        admin: false
    })
    
    try{
        let utilisateurExistant= await Utilisateur.findOne({nom:req.body.name})
        if(utilisateurExistant){
            return res.json({
                err:1,
                message: "Ce nom d'utilisateur est déjà utilisé."
            })
        }

        const salt = await bcrypt.genSalt(10);
        utilisateur.password = await bcrypt.hash(utilisateur.password, salt);
        await utilisateur.save()
        
        return res.json({
            err:0,
            message: "Enregistrement réussi."
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

        let isAdmin=false
        if(user.admin){
            isAdmin=true
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.json({
                err:2,
                message: "Mot de passe incorrect!"
            });
        };


        return res.json({
            err:0,
            user,
            message: "Connexion OK"
        })

    }catch (erreur) {
        console.error(erreur);
        res.json({
          message: "Erreur serveur"
        });        
      }
}

//Suppression d'un utilisateur correspondant à un identifiant
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

//Mise à jour des informations d'un utilisateur correspondant à un identifiant
const updateUtilisateur = async (req, res , next) => {
    let id=req.body.userID

    let tel=-1
    let codepostal=-1

    if(req.body.tel!=='' && /^([0-9]{1,10})$/.test(req.body.tel)){    //Verification telephone non vide et seulement composé de numéro
        tel=req.body.tel
    }
    if(req.body.codepostal!=='' && /^([0-9]{1,10})$/.test(req.body.codepostal)){
        codepostal=req.body.codepostal
    }
    
    let updatedUtilisateur = {
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        email: req.body.email,
        tel: tel,
        ville: req.body.ville,
        codepostal: codepostal,
        rue: req.body.rue
    }

    //Si le mot de passe est renseigné
    if(req.body.password!==''){
        if(!/^([a-zA-Z0-9]{4,16})$/.test(req.body.password)){
            return res.json({
                message: "Le format du mot de passe est incorrect.",
                err:3
            })
        }
        const salt = await bcrypt.genSalt(10);
        updatedUtilisateur.password = await bcrypt.hash(req.body.password, salt);
    }

    Utilisateur.findByIdAndUpdate(id, {$set: updatedUtilisateur}).then(()=>{
        res.json({
            message: "Votre compte a bien été mis à jour.",
            err:0
        })
    }).catch(()=>{
        res.json({
            message: "updateUtilisateur: Une erreur est survenue.",
            err:1
        })
    })

}

module.exports = {showAll, showUtilisateur, showMe, registerUtilisateur, loginUtilisateur, deleteUtilisateur, updateUtilisateur}