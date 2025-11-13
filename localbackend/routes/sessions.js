const express = require('express');
const router = express.Router();
const sessionsController = require('../controllers/sessionsController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, sessionsController.getAllSessions);
router.get('/:id', authMiddleware, sessionsController.getSessionById);
router.post('/', authMiddleware, sessionsController.createSession);
router.put('/:id', authMiddleware, sessionsController.updateSession);
router.delete('/:id', authMiddleware, sessionsController.deleteSession);

module.exports = router;
