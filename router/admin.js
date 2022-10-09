const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');

const validator = require('../middlewares/validation');
const { isAdmin } = require('../middlewares/auth');

router.use(isAdmin);

router.get('/orders', adminController.getOrders);

router.patch('/orders/:orderId', validator.mongoId('orderId'), validator.orderStatus, adminController.patchOrder);

module.exports = router;