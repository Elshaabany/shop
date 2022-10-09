const express = require('express');
const router = express.Router();

const productController = require('../controllers/product');

const validator = require('../middlewares/validation');
const {  isAdmin, isAuthorizedProduct } = require('../middlewares/auth');

router.get('/', productController.getProducts);

router.use('/:productId', validator.mongoId('productId'));

router.get('/:productId', productController.getProduct);

router.use(isAdmin);

router.delete('/:productId', isAuthorizedProduct, productController.deleteProduct);

router.use(validator.product);

router.post('/', productController.postProduct);

router.put('/:productId', isAuthorizedProduct, productController.putProduct);


module.exports = router;