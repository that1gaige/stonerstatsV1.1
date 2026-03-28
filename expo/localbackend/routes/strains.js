const express = require('express');
const router = express.Router();
const strainsController = require('../controllers/strainsController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, strainsController.getAllStrains);
router.get('/:id', authMiddleware, strainsController.getStrainById);
router.post('/', authMiddleware, strainsController.createStrain);
router.put('/:id', authMiddleware, strainsController.updateStrain);
router.delete('/:id', authMiddleware, strainsController.deleteStrain);

module.exports = router;
