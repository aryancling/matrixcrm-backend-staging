const express = require('express');
const router = express.Router();
const {
    createPayment,
    getPaymentByServiceId,
    updatePaymentStatus,
} = require('./payment-controller');
router.post('/create-payments', createPayment);
router.get('/service/:serviceId', getPaymentByServiceId);
router.post('/update-by-Id/:id', updatePaymentStatus);

module.exports = router;
