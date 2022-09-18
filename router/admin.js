const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');

const validator = require('../middlewares/validation');
const { isAdmin } = require('../middlewares/auth');

router.use(isAdmin);

router.get('/order', adminController.getOrders);

router.patch('/order/:orderId', validator.mongoId('orderId'), validator.orderStatus, adminController.patchOrder);

module.exports = router;