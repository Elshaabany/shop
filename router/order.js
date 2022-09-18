const express = require('express');
const router = express.Router();

const orderController = require('../controllers/order');

const validator = require('../middlewares/validation');
const { isAuth, isAuthorizedOrder } = require('../middlewares/auth');

router.use(isAuth);

router.get('/', orderController.getOrders);

router.post('/place', orderController.postOrder);

router.delete('/:orderId', validator.mongoId('orderId'), isAuthorizedOrder, orderController.cancelOrder);

module.exports = router;