const express = require('express');
const router = express.Router();
const strainsController = require('../controllers/strainsController');

router.get('/', strainsController.getAllStrains);
router.get('/:id', strainsController.getStrainById);
router.post('/', strainsController.createStrain);
router.put('/:id', strainsController.updateStrain);
router.delete('/:id', strainsController.deleteStrain);

module.exports = router;
