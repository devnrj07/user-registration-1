const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 13
    },
    email: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 80,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 255
    }
}));

function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(13).required(),
        email: Joi.string().min(6).max(80).required().email(),
        password: Joi.string().min(8).max(255).required()
    };
    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;