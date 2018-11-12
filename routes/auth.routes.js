const express = require('express');
const validate = require('express-validation');
const Joi = require('joi');
const authController = require('../controller/auth.controller');

const router = express.Router();

const paramValidation = {
    login: {
        body: {
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        }
    },
    registerUser: {
        body: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            phone: Joi.number().integer().min(6000000000).max(9999999999).required(),
        }
    }
};

router.route('/login')
// POST /api/auth/login To LOGIN into the system.
    .post(validate(paramValidation.login), authController.login);

router.route('/register')
// POST /api/auth/register To Register in the system.
    .post(validate(paramValidation.registerUser), authController.register);

module.exports = router;