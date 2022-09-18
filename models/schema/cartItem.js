const mongoose = require('mongoose');
const { Schema } = mongoose;
const _ = require('lodash');

const cartItemSchema = new Schema({
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    }

},{
    toJSON: {
        transform: (doc, ret) => _.pick(ret, ['product', 'quantity'])
    }
});

module.exports = cartItemSchema;