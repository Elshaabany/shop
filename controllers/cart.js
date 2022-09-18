const CustomError = require('../helpers/CustomError');
const Product = require('../models/product');

exports.getCart = async (req, res, next) => {

    const user = await req.user.populate('cart.product');

    if (!user.cart.length) throw new CustomError('cart is empty', 404);

    res.json({ cart: user.cart });

};

exports.postCart = async (req, res, next) => {

    const productId = req.params.productId;
    const q = req.query.q;
    const user = req.user;

    if (!await Product.exists({ _id: productId })) throw new CustomError('product doesn\'t exist', 404);

    let exsist = 0;

    user.cart.forEach(p => {
        if (p.product == productId) {
            p.quantity += q ? q : 1;
            exsist = 1;
        }
    });

    if (!exsist) user.cart.push({ product: productId, quantity: q });

    await user.save();

    await user.populate('cart.product');

    res.json({
        message: 'product added to cart.',
        cart: user.cart
    });

};

exports.patchCart = async (req, res, next) => {

    const productId = req.params.productId;
    const q = req.query.q;
    const user = req.user;

    let found = 0;

    user.cart.forEach(p => {
        if (p.product == productId) {
            p.quantity = q;
            found = 1;
        }
    });

    if (!found) throw new CustomError('cart item not found', 404);

    if (!await Product.exists({ _id: productId })) throw new CustomError('product no longer available', 404);

    await user.save();

    await user.populate('cart.product');

    res.json({
        message: 'quantity updated.',
        cart: user.cart
    });

};

exports.deleteCart = async (req, res, next) => {

    const productId = req.params.productId;
    const user = req.user;

    let found = 0;

    user.cart.forEach(p => {
        if (p.product == productId) {
            p.remove();
            found = 1;
        }
    });

    if (!found) throw new CustomError('cart item not found', 404);

    await user.save();

    await user.populate('cart.product');

    res.json({
        message: 'product removed form cart',
        cart: user.cart
    });

};

exports.clearCart = async (req, res, next) => {

    const user = req.user;

    if (!user.cart.length) throw new CustomError('cart is already empty', 400);

    user.cart = [];

    await user.save();

    res.json({ message: 'cart is clear now' });

};