const express=require('express')
const router = express.Router()
const EquipementController = require('./equipementController')

router.get('/',EquipementController.showAll)
router.get('/showPieces',EquipementController.showPieces)
router.post('/newEquipement',EquipementController.newEquipement)


module.exports = router 