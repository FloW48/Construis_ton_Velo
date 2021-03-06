const express=require('express')
const router = express.Router()
const EquipementController = require('./equipementController')

router.get('/',EquipementController.showAll)
router.get('/showPieces',EquipementController.showPieces)
router.get('/showPiece',EquipementController.showPiece)
router.post('/newEquipement',EquipementController.newEquipement)
router.get('/deleteAll',EquipementController.deleteAll)
router.get('/findMinPrice',EquipementController.findMinPrice)


module.exports = router 