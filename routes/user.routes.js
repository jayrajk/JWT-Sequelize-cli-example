const express = require('express');
const validate = require('express-validation');
const Joi = require('joi');
const userController = require('../controller/user.controller');

const router = express.Router();

const paramValidation = {
    updateUser: {
        body: {
            name: Joi.string(),
            email: Joi.string().email().required(),
            phone: Joi.string()
        },
        params: {
            id: Joi.string().required(),
        },
    },
    getUser:{
        params: {
            id: Joi.number().integer().required(),
        },
    }
};

router.route('/')
// GET /api/users. all the users.
    .get(userController.getAll);

router.route('/profile')
// GET /api/users/profile. all the users.
    .get(userController.getProfile);

router.route('/:id')
// GET /api/users/:userId. all the users.
    .get(validate(paramValidation.getUser),userController.getById)
    .put(validate(paramValidation.updateUser), userController.update)
    .delete(validate(paramValidation.getUser), userController.deleteUser);

module.exports = router;