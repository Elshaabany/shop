const { host, port } = require('./util/config');
const fs = require('fs');
const db = require('./util/db');
const express = require('express');
require('express-async-errors');
const helmet = require('helmet');
const { marked } = require('marked');

const userRouter = require('./router/user');
const productRouter = require('./router/product');
const cartRouter = require('./router/cart');
const orderRouter = require('./router/order');
const adminRouter = require('./router/admin');
const compression = require('compression');

const app = express();

app.use(express.static('./public'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/user', userRouter);
app.use('/products', productRouter);
app.use('/cart', cartRouter);
app.use('/orders', orderRouter);
app.use('/admin', adminRouter);

fs.writeFileSync('./public/index.html', marked.parse(fs.readFileSync('./README.md').toString()));
app.get('/', (req, res, next) => {
    res.redirect('index.html');
});

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({ message: err.message, errors: err.errors });
});

db()
    .then(() => {
        app.listen(port, () => {
            console.log(`server running at http://${host}:${port}`);
        });
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });