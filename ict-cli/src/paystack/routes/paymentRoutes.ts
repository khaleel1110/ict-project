const express = require('express');
const router = express.Router();
const { initializeTransaction } = require('../controllers/paymentController');

router.post('/initialize', initializeTransaction);

module.exports = router;
