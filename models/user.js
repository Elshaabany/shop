const mongoose = require('mongoose');
const { Schema } = mongoose;
const util = require('util');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const cartItemSchema = require('./schema/cartItem');
const CustomError = require('../helpers/CustomError');

const singJWT = util.promisify(jwt.sign);
const verifyJWT = util.promisify(jwt.verify);

const { saltRounds, JWT_Secret } = require('../util/config');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        require: true
    },

    isAdmin: {
        type: Boolean,
        default: false
    },

    cart: [cartItemSchema]

}, {
    toJSON: {
        transform: (doc, ret) => _.pick(ret, ['username', 'email', '_id'])
    }
});

userSchema.pre('validate', async function (next) {

    if (this.isModified('username')) {
        if (await User.exists({ username: this.username })) throw new CustomError('username already exist', 400);
    }

    if (this.isModified('email')) {
        if (await User.exists({ email: this.email })) throw new CustomError('email already exist', 400);
    }
    next();
});

userSchema.pre('save', async function (next) {

    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});

userSchema.methods.checkPassword = function (plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
};

userSchema.methods.generateToken = function () {
    return singJWT({ id: this.id }, JWT_Secret, { expiresIn: '1h' });
};

userSchema.statics.getUserFromToken = async function (token) {
    const User = this;
    const { id } = await verifyJWT(token, JWT_Secret);
    const user = await User.findById(id);
    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;