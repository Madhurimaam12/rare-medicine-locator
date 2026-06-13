const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const verifyToken = require('../middleware/auth');

router.get('/search', medicineController.searchMedicines);
router.post('/', verifyToken, medicineController.addMedicine);
router.get('/my-medicines/:pharmacyId', verifyToken, medicineController.getMyMedicines);
router.put('/:id/stock', verifyToken, medicineController.updateStock);
router.delete('/:id', verifyToken, medicineController.deleteMedicine);

module.exports = router;