const express=require('express')
const router = express.Router()
const UtilisateurController = require('./utilisateurController')
const auth = require("./middleware/auth");

router.get('/',UtilisateurController.showAll)
router.get('/showUtilisateur',UtilisateurController.showUtilisateur)
router.get('/showMe', auth, UtilisateurController.showMe)
router.post('/registerUtilisateur',UtilisateurController.registerUtilisateur)
router.post('/loginUtilisateur',UtilisateurController.loginUtilisateur)
router.get('/deleteUtilisateur',UtilisateurController.deleteUtilisateur)
router.post('/updateUtilisateur',UtilisateurController.updateUtilisateur)

module.exports = router 