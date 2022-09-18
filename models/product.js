const mongoose = require('mongoose');
const { Schema } = mongoose;
const _ = require('lodash');

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    URL: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: false
    },

    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => _.pick(ret, ['_id', 'name', 'price', 'URL', 'description'])
    }
});

productSchema.methods.isAuthorized = function (user) {
    return this.createdBy.toString() === user._id.toString();
};

productSchema.statics.getProductsCreatedByUser = async function (userId) {
    return await this.find().where('createdBy', userId);
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;