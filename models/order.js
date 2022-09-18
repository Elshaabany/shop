const mongoose = require('mongoose');
const { Schema } = mongoose;
const _ = require('lodash');

const orderItemSchema = require('./schema/orderItem');

const orderSchema = new Schema({

    products: [orderItemSchema],

    status: {
        type: String,
        required: true,
        enum: ['pending', 'accepted', 'out-for-deleviry', 'delivered', 'canceled']
    },

    total: Number,

    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }

}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => _.omit(ret, ['__v'])
    }
});

orderSchema.statics.getOrdersByUserId = async function (userId) {
    return await this.find().where('createdBy', userId).populate('products.product');
};

const Order = mongoose.model('order', orderSchema);

module.exports = Order;