const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const verifyToken = require('../middleware/auth');

router.post('/', verifyToken, requestController.createRequest);
router.get('/user/:userId', verifyToken, requestController.getUserRequests);
router.get('/all', verifyToken, requestController.getAllRequests);
router.put('/:id/status', verifyToken, requestController.updateRequestStatus);

module.exports = router;