const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cart');

const validator = require('../middlewares/validation');
const { isAuth } = require('../middlewares/auth');

router.use(isAuth);

router.get('/', cartController.getCart);

router.delete('/', cartController.clearCart);

router.use('/:productId', validator.mongoId('productId'));

router.delete('/:productId', cartController.deleteCart);

router.use(validator.quantity);

router.put('/:productId', cartController.postCart);

router.patch('/:productId', cartController.patchCart);

module.exports = router;