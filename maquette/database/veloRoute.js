const express=require('express')
const router = express.Router()
const VeloController = require('./veloController')

router.get('/',VeloController.showAll)
router.get('/showPieces',VeloController.showVelo)
router.get('/showVelosOfUser',VeloController.showVelosOfUser)
router.post('/newVelo',VeloController.newVelo)
router.get('/deleteAll',VeloController.deleteAll)

module.exports = router 