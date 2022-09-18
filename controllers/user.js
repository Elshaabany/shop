const User = require('../models/user');
const CustomError = require('../helpers/CustomError');
const transporter = require('../util/mail');
const { senderMail } = require('../util/config');
const Order = require('../models/order');
const Product = require('../models/product');

exports.postSignup = async (req, res, next) => {

    const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    });

    const token = await user.generateToken();
    
    transporter.sendMail({
        to: req.body.email,
        from: senderMail,
        subject: 'Signup succeeded',
        html: '<h1> you successfully signed up!</h1>'
    })
        .then(console.log)
        .catch(console.error);

    res.json({
        message: 'user created successfully',
        user,
        token
    });

};

exports.postSignin = async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new CustomError('email or password is not correct', 401);
    const isMatch = await user.checkPassword(req.body.password);
    if (!isMatch) throw new CustomError('email or password is not correct', 401);

    const token = await user.generateToken();

    res.json({
        message: 'loged in successfully',
        user,
        token
    });

};

exports.getProfile = async (req, res, next) => {

    const user = req.user;

    const orders = await Order.getOrdersByUserId(user._id);

    const myProducts = await Product.getProductsCreatedByUser(user._id);

    await user.populate('cart.product');

    res.json({ 
        user: user, 
        cart: user.cart.length ? user.cart : undefined,
        orders: orders.length ? orders : undefined,
        myProducts: myProducts.length ? myProducts : undefined
    });
};