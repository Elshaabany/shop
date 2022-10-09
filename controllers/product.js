const Product = require('../models/product');
const CustomError = require('../helpers/CustomError');

exports.getProducts = async (req, res, next) => {

    let page = req.query.page;
    page = page > 0 ? page : 1;
    let size = req.query.size;
    size = size > 0 ? size : 0;
    const totalProducts = await Product.find().countDocuments();
    const products = await Product.find().skip((page - 1) * size).limit(size).populate('createdBy');
    if (!products.length) throw new CustomError('no products found', 404);
    res.json({ products, totalProducts });

};

exports.getProduct = async (req, res, next) => {

    const Id = req.params.productId;
    const product = await Product.findById(Id).populate('createdBy');
    if (!product) throw new CustomError('product doesn\'t exist', 404);
    res.json(product);

};

exports.postProduct = async (req, res, next) => {

    const product = await Product.create({
        name: req.body.name,
        price: req.body.price,
        URL: req.body.URL,
        description: req.body.description || '',
        createdBy: req.user._id
    });

    res.status(201).json({
        message: 'added succssefully',
        product: await product.populate('createdBy')
    });

};

exports.putProduct = async (req, res, next) => {

    const product = req.product;

    await product.updateOne({
        name: req.body.name,
        price: req.body.price,
        URL: req.body.URL,
        description: req.body.description || ''
    });

    res.json({
        message: 'updated succssefully',
        product: await product.populate('createdBy')
    });

};

exports.deleteProduct = async (req, res, next) => {

    const productId = req.params.productId;

    await Product.deleteOne({ _id: productId });
    res.json({
        message: 'deleted succssefully'
    });

};