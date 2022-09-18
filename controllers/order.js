const Order = require('../models/order');
const CustomError = require('../helpers/CustomError');
const transporter = require('../util/mail');
const { senderMail } = require('../util/config');

exports.getOrders = async (req, res, next) => {

    const userId = req.user._id;

    const orders = await Order.getOrdersByUserId(userId);

    if (!orders.length) throw new CustomError('no orders yet', 404);

    res.json({ orders });

};

exports.postOrder = async (req, res, next) => {

    const user = await req.user.populate('cart.product');

    if (!user.cart.length) throw new CustomError('cart is Empty', 400);

    let total = 0;

    user.cart.forEach( p => { 
        if (!p.product) throw new CustomError('product is no longer available', 404);
    });

    user.cart.forEach(p => {
        total += p.quantity * p.product.price;
    });

    const createdOrder = await Order.create({
        products: user.cart,
        status: 'pending',
        createdBy: user._id,
        total
    });

    user.cart = [];

    await user.save();

    await createdOrder.populate('products.product');

    transporter.sendMail({
        to: req.user.email,
        from: senderMail,
        subject: 'Order created successfully',
        html:
            `<h1> your order has been placed. </h1>
        <p> you will get it as soon as possible </p>
        <table border="1">
            <caption> Order Details </caption>
            <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
            </tr>
            ${createdOrder.products.map(p => `
            <tr align="center">
                <td>${p.product.name}</td>
                <td>${p.quantity}</td>
                <td>${p.product.price}</td>
            </tr>`).toString().split(',').join(' ')}
            <tr align="center">
                <td colspan="2">Total</td>
                <td>${total}</td>
            </tr>
        </table>`
    }).then(console.log).catch(console.error);

    res.json({
        message: 'order created successfully',
        createdOrder
    });

};

exports.cancelOrder = async (req, res, next) => {

    const orderId = req.params.orderId;

    const order = await Order.findById(orderId);

    if (!order) throw new CustomError('order not found', 404);

    order.status = 'canceled';

    await order.save();

    transporter.sendMail({
        to: req.user.email,
        from: senderMail,
        subject: 'Order cancelled.',
        html: '<h1> your order has been cancelled as you requested</h1>'
    }).then(console.log).catch(console.error);

    res.json({
        message: 'order cancelled',
        order
    });

};