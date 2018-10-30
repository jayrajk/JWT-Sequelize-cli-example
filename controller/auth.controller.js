const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helper/APIError');
const config = require('../config');
const User = require('../controller/user.controller');

module.exports = {

    /**
     * Send the token and user Details if given email and password is valid.
     * @property req.body.email = The email of user.
     * @property res.body.password = the password of the user.
     * @returns token and user.
     */
    login(req, res, next) {
        User.getByEmail(req.body.email)
            .then((foundUser) => {
                if (!foundUser) {
                    const err = new APIError('User not found', httpStatus.UNAUTHORIZED, true);
                    return next(err);
                }
                if (!foundUser.validPassword(req.body.password)) {
                    const err = new APIError('InCorrect Email or Password', httpStatus.UNAUTHORIZED, true);
                    return next(err);
                }

                const token = jwt.sign(foundUser.safeModel(), config.jwtSecret, {
                    expiresIn: config.jwtExpiresIn,
                });
                return res.json({
                    token,
                    user: foundUser.safeModel()
                })
            })
            .catch(err => next(new APIError(err.message, httpStatus.NOT_FOUND)));
    },

    register(req, res, next) {
        User.getByEmail(req.body.email)
            .then((foundUser) => {
                if (foundUser) {
                    return Promise.reject(new APIError('Email Must be Unique', httpStatus.CONFLICT, true));
                }
                req.body.password = User.generatePassword(req.body.password);
                return User.create(req.body);
            })
            .then((savedUser) => {
                const token = jwt.sign(savedUser.safeModel(), config.jwtSecret, {
                    expiresIn: config.jwtExpiresIn,
                });
                return res.json({
                    token: token
                });
            })
            .catch(e => next(e));
    }
};