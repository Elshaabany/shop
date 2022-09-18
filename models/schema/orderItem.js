const mongoose = require('mongoose');
const { Schema } = mongoose;
const _ = require('lodash');

const orderItemSchema = new Schema({
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    },
    quantity: Number
}, {
    toJSON: {
        transform: (doc, ret) => _.pick(ret, ['product', 'quantity'])
    }
});

module.exports = orderItemSchema;