const CustomError = require('../helpers/CustomError');
const Order = require('../models/order');
const transporter = require('../util/mail');
const { senderMail } = require('../util/config');

exports.getOrders = async (req, res, next) => {
    const orders = await Order.find().populate('products.product').populate('createdBy');
    if (!orders.length) throw new CustomError('no orders yet', 404);
    res.json({ orders });
};

exports.patchOrder = async (req, res, next) => {
   
    const order = await Order.findById(req.params.orderId).populate('products.product').populate('createdBy');
    if (!order) throw new CustomError('order doesn\'t exist.', 404);

    order.status = req.body.status;

    await order.save();

    transporter.sendMail({
        to: req.user.email,
        from: senderMail,
        subject: 'Order status updated.',
        html: `<h1> your order is ${order.status} now</h1>`
    }).then(console.log).catch(console.error);

    res.json({ message: 'order status updated', order });
};